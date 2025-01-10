import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        try {
            const response = await axios.post('http://localhost:5000/api/v1/login', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <LoginStyled>
            <div className="auth-container">
                <h2>Welcome Back</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                    <div className="links">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div className="register-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </LoginStyled>
    );
};

const LoginStyled = styled.div`
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

                &:focus {
                    border-color: var(--primary-color);
                }
            }
        }

        .links {
            text-align: right;
            margin-bottom: 1rem;

            a {
                color: var(--primary-color);
                text-decoration: none;
                
                &:hover {
                    text-decoration: underline;
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
            transition: opacity 0.3s;

            &:hover {
                opacity: 0.9;
            }
        }

        .register-link {
            text-align: center;
            margin-top: 1rem;

            a {
                color: var(--primary-color);
                text-decoration: none;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }

        .error {
            color: red;
            text-align: center;
            margin-bottom: 1rem;
            padding: 0.5rem;
            background: rgba(255, 0, 0, 0.1);
            border-radius: 5px;
        }
    }
`;

export default Login; 