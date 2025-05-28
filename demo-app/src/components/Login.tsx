import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import ThemeSwitcher from './ThemeSwitcher.tsx';
import { DARK_THEME, LIGHT_THEME } from '../constants/theme.ts';
import axios from 'axios';
import LoginResponse from "../model/login.model.tsx";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [, setCurrentTheme] = useState<typeof LIGHT_THEME | typeof DARK_THEME>(LIGHT_THEME);
    const navigate = useNavigate();


    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 && response.data.success) {
                const {token, role, personId} = response.data;

                sessionStorage.setItem('token', token);
                sessionStorage.setItem('user_role', role);
                sessionStorage.setItem('personId', personId);

                console.log('Login successful. Token:', token);
                console.log('Saved Person ID in sessionStorage:', personId);
                console.log('User role:', role);

                if (role === 'ADMIN') {
                    console.log("Redirecting to admin dashboard");
                    navigate('/admin-dashboard');
                } else {
                    console.log("Redirecting to user dashboard");
                    navigate('/dashboard');
                }
            } else {
                setErrorMessage(response.data.errorMessage || 'Login failed. Please check your credentials.');
            }
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.response?.status === 401) {
                setErrorMessage('Incorrect email or password.');
            } else if (error.response?.data?.errorMessage) {
                setErrorMessage(error.response.data.errorMessage);
            } else {
                setErrorMessage('Login failed. Please try again later.');
            }
        }
    };


    /*
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data : LoginResponse = response.data;
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('role', data.role);
                console.log('Login successful:', data);

                //navigate('/dashboard');
                // Navigate based on the user role
                if (data.role === 'ADMIN') {
                    navigate('/admin-dashboard');  // Redirect admin to admin dashboard
                } else {
                    navigate('/dashboard');  // Redirect regular user to user dashboard
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.error('Login failed:', error.response.data);
                setErrorMessage(error.response.data.errorMessage);
            } else {
                console.error('An unexpected error occurred:', error);
                setErrorMessage('Failed to login. Please try again later.');
            }
        }
    };


     */
    return (
        <div className="login-page-wrapper">
            <div className="login-background"></div>

            <div className="login-container">
                <ThemeSwitcher onThemeChange={setCurrentTheme} />
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit">Login</button>
                    <button type="button" onClick={() => navigate('/register')}>Register</button>
                    <button type="button" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
                </form>
            </div>
        </div>
    );


};

const styles = {
    container: {
        backgroundImage: 'url("/images/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurOverlay: {
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '40px',
        borderRadius: '12px',
        color: 'white',
        width: '90%',
        maxWidth: '400px',
    },
    formBox: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '10px',
    },
};

export default Login;