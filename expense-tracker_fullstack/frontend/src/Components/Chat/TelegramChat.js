import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';

const TelegramChat = () => {
    const [messages, setMessages] = useState([
        { text: "Xin chào, tôi là trợ lý tài chính của bạn, ghi lại thông tin các giao dịch của bạn hoặc đưa ra câu hỏi", isUser: false }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addIncome, addExpense } = useGlobalContext();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
        setIsLoading(true);

        try {
            console.log('Sending message:', inputMessage); // Debug log

            // Đảm bảo URL này match với route trong backend
            const response = await fetch('http://localhost:5000/api/v1/process-message', {  // Sửa URL này
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage })
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data); // Debug log

            if (data.transaction) {
                setMessages(prev => [...prev.filter(msg => !msg.isLoading), { 
                    text: data.reply, 
                    isUser: false 
                }]);
            }

        } catch (error) {
            console.error('Error details:', error);
            setMessages(prev => [...prev.filter(msg => !msg.isLoading), { 
                text: `Connection error: ${error.message}. Is the server running?`, 
                isUser: false 
            }]);
        }

        setIsLoading(false);
        setInputMessage('');
    };

    return (
        <ChatStyled>
            <div className="chat-header">
                <h2>AI Financial Assistant</h2>
                <p>Chat with AI to manage your finances</p>
            </div>
            
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message ${msg.isUser ? 'user' : 'bot'} ${msg.isLoading ? 'loading' : ''}`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type something like 'income 30000 from salary'"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </ChatStyled>
    );
}

const ChatStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem;
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;

    .chat-header {
        padding: 1rem;
        h2 {
            color: var(--primary-color);
            font-size: 1.5rem;
            font-weight: 600;
        }
    }

    .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .message {
            max-width: 70%;
            padding: 0.8rem 1rem;
            border-radius: 1rem;
            margin: 0.5rem 0;
            
            &.user {
                background: #0088cc;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 0.3rem;
            }
            
            &.bot {
                background: #e9ecef;
                color: black;
                align-self: flex-start;
                border-bottom-left-radius: 0.3rem;
            }

            &.loading {
                opacity: 0.7;
                font-style: italic;
            }
        }
    }

    .chat-input {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 1rem;
        margin-top: 1rem;

        input {
            flex: 1;
            border: none;
            padding: 0.5rem;
            font-size: 1rem;
            outline: none;
        }

        button {
            background: #0088cc;
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background: #006699;
            }
        }

        button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    }
`;

export default TelegramChat;