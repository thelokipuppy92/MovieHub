import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleEnter = () => {
        const token = sessionStorage.getItem('auth_token');
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.overlay}>
                <h1 style={styles.title}>Welcome to MovieHub</h1>
                <p style={styles.subtitle}>Discover and explore your favorite movies!</p>
                <button style={styles.button} onClick={handleEnter}>
                    Enter App
                </button>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url("/images/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center' as const,
        maxWidth: '90%',
        color: 'white',
    },
    title: {
        fontSize: '3rem',
        marginBottom: '20px',
    },
    subtitle: {
        fontSize: '1.25rem',
        marginBottom: '30px',
    },
    button: {
        fontSize: '1.25rem',
        padding: '12px 30px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#e50914',
        color: 'white',
    },
};

export default LandingPage;
