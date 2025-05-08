import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import {createContext, JSX} from "react";
import AdminDashboard from "./components/AdminDashboard.tsx";
import {toast, ToastContainer} from "react-toastify";
import ForgotPassword from './components/ForgotPassword';
import AuthenticatedRouteGuard from "./config/authenticatedRouteGuard.tsx";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = sessionStorage.getItem("auth_token");
    return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const token = sessionStorage.getItem("auth_token");
    const role = sessionStorage.getItem("user_role");
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
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route element={<AuthenticatedRouteGuard />}>
                    <Route path="/dashboard"  element={<Dashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />

                </Route>
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>

    );
}

export default App;