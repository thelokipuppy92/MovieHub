import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/forgotPassword';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    const extractErrorMessage = (err: any): string => {
        const data = err?.response?.data;
        if (!data) return 'Something went wrong';
        if (typeof data === 'string') return data;
        if (typeof data === 'object') {
            return data.message || data.error || 'Unexpected error occurred';
        }
        return 'Unknown error';
    };

    const handleSendOtp = async () => {
        if (!email.includes('@')) {
            setMessage('Please enter a valid email address.');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/verifyMail/${email}`);
            setMessage(typeof res.data === 'string' ? res.data : 'OTP sent successfully.');
            setIsOtpSent(true);
        } catch (err: any) {
            setMessage(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            setMessage('Please enter the OTP.');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/verifyOtp/${otp}/${email}`);
            setMessage(typeof res.data === 'string' ? res.data : 'OTP verified.');
            setIsOtpVerified(true);
        } catch (err: any) {
            setMessage(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        if (password !== repeatPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/changePassword/${email}`, {
                password,
                repeatPassword
            });
            setMessage(typeof res.data === 'string' ? res.data : 'Password changed successfully.');

            // Reset everything
            setEmail('');
            setOtp('');
            setPassword('');
            setRepeatPassword('');
            setIsOtpSent(false);
            setIsOtpVerified(false);
        } catch (err: any) {
            setMessage(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100vw',
        }}>
        <div style={{
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px'
        }}>
            <h2>Forgot Password</h2>

            {message && <p style={{ color: 'blue' }}>{message}</p>}

            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button onClick={handleSendOtp} disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
            </div>

            {/* OTP Input */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '20px'
            }}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={!isOtpSent}
                />
                <button onClick={handleVerifyOtp} disabled={!isOtpSent || loading}>
                    {loading ? 'Verifying OTP...' : 'Verify OTP'}
                </button>
            </div>

            {/* New Password */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '20px'
            }}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={!isOtpVerified}
                />
                <input
                    type="password"
                    placeholder="Repeat new password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                    disabled={!isOtpVerified}
                />
                <button onClick={handleChangePassword} disabled={!isOtpVerified || loading}>
                    {loading ? 'Changing Password...' : 'Change Password'}
                </button>
            </div>
        </div>
        </div>
    );
};

export default ForgotPassword;
