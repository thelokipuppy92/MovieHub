import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import {JSX} from "react";
import AdminDashboard from "./components/AdminDashboard.tsx";
import {toast, ToastContainer} from "react-toastify";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("admin_token");
    return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("admin_token");
    const role = localStorage.getItem("user_role");
    if (token && role === 'ADMIN') {
        return children;
    } else {
        return <Navigate to="/dashboard" replace />;
    }
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>

    );
}

export default App;