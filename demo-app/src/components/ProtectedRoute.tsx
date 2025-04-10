import { Navigate } from 'react-router-dom';
import {JSX} from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('admin_token');
    return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
