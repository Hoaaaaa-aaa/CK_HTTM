import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/forgot-password', { email });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
            setMessage('');
        }
    };

    return (
        <ForgotPasswordStyled>
            <div className="auth-container">
                <h2>Reset Password</h2>
                {message && <div className="success">{message}</div>}
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Send Reset Link</button>
                </form>
                <div className="back-to-login">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </ForgotPasswordStyled>
    );
};

const ForgotPasswordStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: rgba(252, 246, 249, 0.78);

    .auth-container {
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        width: 400px;

        h2 {
            text-align: center;
            color: var(--primary-color);
            margin-bottom: 2rem;
            font-size: 1.9rem;
        }

        .input-group {
            margin-bottom: 1rem;

            input {
                width: 100%;
                padding: 0.8rem;
                border: 2px solid #ddd;
                border-radius: 5px;
                outline: none;
                transition: border-color 0.3s;
                font-size: 1.1rem;

                &:focus {
                    border-color: var(--primary-color);
                }
            }
        }

        button {
            width: 100%;
            padding: 0.8rem;
            background: var(--primary-color);
            border: none;
            border-radius: 5px;
            color: white;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background: #222260;
                transform: translateY(-2px);
            }
        }

        .back-to-login {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 1.1rem;

            a {
                color: var(--primary-color);
                text-decoration: none;
                font-weight: 600;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }

        .error {
            color: #e74c3c;
            text-align: center;
            margin-bottom: 1rem;
            padding: 0.8rem;
            background: rgba(231, 76, 60, 0.1);
            border-radius: 5px;
            font-size: 1rem;
        }

        .success {
            color: #27ae60;
            text-align: center;
            margin-bottom: 1rem;
            padding: 0.8rem;
            background: rgba(39, 174, 96, 0.1);
            border-radius: 5px;
            font-size: 1rem;
        }
    }

    @media (max-width: 500px) {
        .auth-container {
            width: 90%;
            margin: 0 1rem;
        }
    }
`;

export default ForgotPassword; 