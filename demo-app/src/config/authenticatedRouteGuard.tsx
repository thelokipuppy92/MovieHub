import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TokenPayload from "../model/tokenPayload.tsx";

const AuthenticatedRouteGuard = () => {
    const token = sessionStorage.getItem("token");
    //console.log("Auth Guard Token:", token);

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode<TokenPayload>(token);

        const isIssuerValid = decodedToken.iss === "demo-spring-boot-backend";
        const isNotExpired = decodedToken.exp * 1000 > Date.now();
        const hasRequiredClaims = decodedToken.userId && decodedToken.role;

        if (!isIssuerValid || !isNotExpired || !hasRequiredClaims) {
            return <Navigate to="/login" />;
        }
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default AuthenticatedRouteGuard;