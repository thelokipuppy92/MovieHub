import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import ThemeSwitcher from './ThemeSwitcher.tsx';
import { DARK_THEME, LIGHT_THEME } from '../constants/theme.ts';
import axios from 'axios';

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
            const response = await axios.post('http://localhost:8080/login', { email, password });

            if (response.status === 200) {
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('user_role', response.data.role);
                localStorage.setItem('personId', response.data.personId);
                console.log('Saved Person ID in localStorage:', localStorage.getItem('personId'));

                // Redirect based on role
                if (response.data.role === 'ADMIN') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            setErrorMessage('Invalid email or password!');
        }
    };




    return (
        <div className="app-container">
            <ThemeSwitcher onThemeChange={setCurrentTheme} />
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit">Login</button>
                <button type="button" onClick={() => navigate('/register')}>Register</button>
            </form>
        </div>
    );
};

export default Login;
