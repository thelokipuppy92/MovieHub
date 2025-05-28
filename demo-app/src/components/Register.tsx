import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const notifyError = (message: string) => toast.error(message);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name || !email || !age || !password || !confirmPassword) {
            notifyError('All fields are required!');
            return;
        }

        const parsedAge = parseInt(age);
        if (isNaN(parsedAge) || parsedAge <= 0) {
            notifyError('Age must be a valid positive number.');
            return;
        }

        if (parsedAge < 18) {
            notifyError('You must be major!');
            return;
        }

        if (password !== confirmPassword) {
            notifyError('Passwords do not match!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format! Email must contain '@' and a valid domain.");
            return;
        }

        if (name.length < 3) {
            toast.error("Name should have at least 3 letters!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/register', {
                name,
                email,
                age: parsedAge,
                password
            });

            if (response.status === 201) {
                toast.success("Registration successful! Go back to login...");
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            notifyError('Failed to register. Email may already be in use.');
        }
    };

    return (
        <div className="register-page-wrapper">
            <ToastContainer />
            <div className="register-background"></div>

            <div className="register-container">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Age:</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button type="submit">Register</button>
                    <button type="button" onClick={() => navigate('/login')}>Back to Login</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
