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
        <div className="forgot-page-wrapper">
            <div className="forgot-background"></div>

            <div className="forgot-container">
                <h2>Forgot Password</h2>

                {message && <p style={{ color: 'blue' }}>{message}</p>}

                {/* Email */}
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

                {/* OTP */}
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={!isOtpSent}
                    style={{ marginTop: '15px' }}
                />
                <button onClick={handleVerifyOtp} disabled={!isOtpSent || loading}>
                    {loading ? 'Verifying OTP...' : 'Verify OTP'}
                </button>

                {/* Passwords */}
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={!isOtpVerified}
                    style={{ marginTop: '15px' }}
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
    );

};

export default ForgotPassword;
