import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/v1/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <RegisterStyled>
            <div className="auth-container">
                <h2>Create Account</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <div className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </RegisterStyled>
    );
};

const RegisterStyled = styled.div`
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

        .login-link {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 1.1rem;

            a {
                color: var(--primary-color);
                text-decoration: none;
                font-weight: 600;
                margin-left: 0.5rem;
                
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
    }

    @media (max-width: 500px) {
        .auth-container {
            width: 90%;
            margin: 0 1rem;
        }
    }
`;

export default Register; 