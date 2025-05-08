interface LoginResponse {
    errorMessage: string;
    role: string;
    success: boolean;
    token: string;
    personId:string;
}

export default LoginResponse;