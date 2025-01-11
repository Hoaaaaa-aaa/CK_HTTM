const { CohereClient } = require('cohere-ai');
const Income = require("../models/IncomeModel");
const Expense = require("../models/ExpenseModel");

// Initialize Cohere client
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const processMessage = async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Processing message:', message);

        // Cải thiện prompt để bao gồm cả ngày
        const prompt = `
        Act as a financial assistant. Extract transaction information from this message: "${message}"
        Return ONLY a JSON object with this exact format:
        {
            "type": "income" or "expense",
            "amount": number (extract from message),
            "category": "string (category of transaction)",
            "date": "YYYY-MM-DD" (extract date from message or use today's date)
        }
        For example, if message is "income 3000 from salary on 2024-01-15", return:
        {"type": "income", "amount": 3000, "category": "salary", "date": "2024-01-15"}
        If message is "chi tiêu 500k cho ăn uống hôm nay", return:
        {"type": "expense", "amount": 500000, "category": "food", "date": "current_date"}
        `;

        const response = await cohere.generate({
            model: 'command',
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.1,
            format: 'json'
        });

        console.log('Cohere response:', response.generations[0].text);

        // Clean up response text to ensure it's valid JSON
        let cleanResponse = response.generations[0].text.trim();
        // Remove any extra text before { and after }
        cleanResponse = cleanResponse.substring(
            cleanResponse.indexOf('{'),
            cleanResponse.lastIndexOf('}') + 1
        );

        try {
            const parsedResponse = JSON.parse(cleanResponse);

            // Convert amount if contains 'k' or 'K'
            let amount = parsedResponse.amount;
            if (typeof amount === 'string') {
                if (amount.toLowerCase().includes('k')) {
                    amount = parseFloat(amount.toLowerCase().replace('k', '')) * 1000;
                }
            }

            // Xử lý ngày
            let transactionDate;
            if (parsedResponse.date && parsedResponse.date !== 'current_date') {
                transactionDate = new Date(parsedResponse.date);
            } else {
                transactionDate = new Date(); // Ngày hiện tại
            }

            if (parsedResponse.type === 'income') {
                const income = new Income({
                    title: message,
                    amount: amount,
                    type: 'income',
                    category: parsedResponse.category,
                    description: 'Income via Chat', 
                    date: transactionDate
                });

                await income.save();
                console.log('Income saved:', income);

                return res.json({
                    reply: `Đã thêm khoản thu: ${amount.toLocaleString('vi-VN')}đ vào ngày ${transactionDate.toLocaleDateString('vi-VN')}`,
                    transaction: income
                });
            } 
            else if (parsedResponse.type === 'expense') {
                const expense = new Expense({
                    title: message,
                    amount: amount,
                    type: 'expense',
                    category: parsedResponse.category,
                    description: 'Expense via Chat',
                    date: transactionDate
                });

                await expense.save();
                console.log('Expense saved:', expense);

                return res.json({
                    reply: `Đã thêm khoản chi: ${amount.toLocaleString('vi-VN')}đ vào ngày ${transactionDate.toLocaleDateString('vi-VN')}`,
                    transaction: expense
                });
            }
        } catch (parseError) {
            console.error('Error parsing Cohere response:', parseError);
            // Fallback to manual parsing
            const words = message.toLowerCase().split(' ');
            let amount = words.find(w => w.includes('k') || !isNaN(w));
            if (amount) {
                amount = parseFloat(amount.replace('k', '')) * (amount.includes('k') ? 1000 : 1);
                if (message.includes('chi tiêu') || message.includes('expense')) {
                    const expense = new Expense({
                        title: message,
                        amount: amount,
                        type: 'expense',
                        category: 'other',
                        description: 'Expense via Chat',
                        date: new Date()
                    });
                    await expense.save();
                    return res.json({
                        reply: `Đã thêm khoản chi: ${amount.toLocaleString('vi-VN')}đ vào ngày ${new Date().toLocaleDateString('vi-VN')}`,
                        transaction: expense
                    });
                }
            }
        }

        return res.json({
            reply: "Xin lỗi, tôi không hiểu. Vui lòng thử lại với format như 'thu nhập 3000k từ lương ngày 15/1/2024' hoặc 'chi tiêu 500k cho ăn uống hôm nay'",
            transaction: null
        });

    } catch (error) {
        console.error('Process message error:', error);
        res.status(500).json({ 
            error: 'Lỗi xử lý tin nhắn',
            details: error.message 
        });
    }
};

const getAdvice = async (req, res) => {
    try {
        console.log('Received data:', req.body); // Debug log
        const { question, totalIncome, totalExpense } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (totalIncome === undefined || totalExpense === undefined) {
            throw new Error('Missing financial data');
        }

        const balance = totalIncome - totalExpense;

        // Format số tiền với VND
        const formatMoney = (amount) => {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        };

        // Tạo prompt cho AI
        const prompt = `Bạn là một chuyên gia tư vấn tài chính. 
        Dựa trên thông tin tài chính sau của khách hàng:
        - Số dư hiện tại: ${formatMoney(balance)}
        - Tổng thu nhập: ${formatMoney(totalIncome)}
        - Tổng chi tiêu: ${formatMoney(totalExpense)}

        Câu hỏi của khách hàng: "${question}"

        Hãy đưa ra lời khuyên chi tiết và thực tế, phù hợp với tình hình tài chính của họ.
        Trả lời bằng tiếng Việt, ngắn gọn nhưng đầy đủ thông tin.`;

        // Gọi Gemini API
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.GOOGLE_AI_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Google AI API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const advice = data.candidates[0].content.parts[0].text;

        res.json({
            advice: advice,
            balance: balance
        });

    } catch (error) {
        console.error('Get advice error:', error);
        res.status(500).json({ 
            error: 'Lỗi lấy tư vấn tài chính',
            details: error.message 
        });
    }
};

module.exports = {
    processMessage,
    getAdvice
}; 