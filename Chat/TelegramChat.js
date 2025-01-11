import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';

const ChatStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f0f2f5;

    .chat-messages {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .message-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-width: 70%;

            &.user {
                align-self: flex-end;
                .message {
                    background: #0084ff;
                    color: white;
                    border-radius: 18px 18px 4px 18px;
                    margin-left: auto;
                }
            }

            &.bot {
                align-self: flex-start;
                .message {
                    background: #e4e6eb;
                    color: black;
                    border-radius: 18px 18px 18px 4px;
                }
            }
        }

        .message {
            padding: 0.8rem 1rem;
            font-size: 0.9rem;
            line-height: 1.4;
        }

        .message-options {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;

            button {
                background: #0084ff;
                color: white;
                border: none;
                padding: 0.8rem 1rem;
                border-radius: 18px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: background 0.2s;

                &:hover {
                    background: #006acc;
                }
            }
        }
    }

    .chat-input {
        padding: 1rem;
        background: white;
        border-top: 1px solid #e4e6eb;

        form {
            display: flex;
            gap: 0.5rem;
        }

        input {
            flex: 1;
            padding: 0.8rem;
            border: 1px solid #e4e6eb;
            border-radius: 20px;
            font-size: 0.9rem;

            &:focus {
                outline: none;
                border-color: #0084ff;
            }
        }

        button {
            background: #0084ff;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.2s;

            &:hover {
                background: #006acc;
            }
        }
    }
`;

const TelegramChat = () => {
    const { totalExpenses, totalIncome, totalBalance } = useGlobalContext();
    const [messages, setMessages] = useState([
        { 
            text: "Xin chào! Tôi là trợ lý tài chính AI. Tôi có thể giúp gì cho bạn?", 
            isBot: true,
            showOptions: true 
        }
    ]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleOptionClick = async (option) => {
        if (option === 'new_transaction') {
            setMessages(prev => [...prev, { 
                text: "Hãy nhập giao dịch của bạn theo format: 'thu nhập 3000k từ lương' hoặc 'chi tiêu 500k cho ăn uống'", 
                isBot: true,
                showOptions: false
            }]);
        } else if (option === 'advice') {
            setMessages(prev => [...prev, { 
                text: "Hãy nhập câu hỏi về tài chính của bạn (ví dụ: 'Làm sao để tiết kiệm tiền hiệu quả?' hoặc 'Tôi nên đầu tư như thế nào với số dư hiện tại?')", 
                isBot: true,
                showOptions: false,
                isAdviceRequest: true
            }]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = message.trim();
        setMessage('');
        
        setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

        const isAdviceRequest = messages[messages.length - 1]?.isAdviceRequest;

        setIsLoading(true);
        try {
            if (isAdviceRequest) {
                const response = await fetch('http://localhost:5000/api/v1/chat/get-advice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        question: userMessage,
                        totalIncome: totalIncome(),
                        totalExpense: totalExpenses(),
                        balance: totalBalance()
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMessages(prev => [...prev, { 
                    text: data.advice, 
                    isBot: true,
                    showOptions: true
                }]);
            } else {
                const response = await fetch('http://localhost:5000/api/v1/chat/process-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: userMessage 
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMessages(prev => [...prev, { 
                    text: data.reply || "Giao dịch đã được xử lý thành công!", 
                    isBot: true,
                    showOptions: true
                }]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.", 
                isBot: true,
                showOptions: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ChatStyled>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-container ${msg.isUser ? 'user' : 'bot'}`}>
                        <div className="message">
                            {msg.text}
                        </div>
                        {msg.isBot && msg.showOptions && (
                            <div className="message-options">
                                <button onClick={() => handleOptionClick('new_transaction')}>
                                    Thêm giao dịch mới
                                </button>
                                <button onClick={() => handleOptionClick('advice')}>
                                    Tư vấn chi tiêu
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="message-container bot">
                        <div className="message">
                            Đang xử lý...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
                <form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                    />
                    <button type="submit">Gửi</button>
                </form>
            </div>
        </ChatStyled>
    );
};

export default TelegramChat;