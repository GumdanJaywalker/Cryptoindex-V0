export interface User {
    id: string;
    auth_type: 'email' | 'wallet';
    email?: string;
    email_verified?: boolean;
    wallet_address?: string;
    wallet_type?: string;
    created_at: string;
    last_login?: string;
    is_active: boolean;
}
export interface UserSession {
    id: string;
    user_id: string;
    session_token: string;
    expires_at: string;
    created_at: string;
}
export interface EmailVerificationCode {
    id: string;
    email: string;
    code: string;
    expires_at: string;
    used: boolean;
    created_at: string;
}
export interface User2FA {
    user_id: string;
    secret_key: string;
    backup_codes: string[];
    enabled: boolean;
    created_at: string;
}
export interface UserWallet {
    id: string;
    user_id: string;
    wallet_address: string;
    encrypted_private_key?: string;
    wallet_provider: string;
    is_primary: boolean;
    created_at: string;
}
export interface RegisterRequest {
    email: string;
}
export interface LoginRequest {
    email: string;
    code: string;
}
export interface VerifyEmailRequest {
    email: string;
    code: string;
}
export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface AuthenticatedRequest extends Request {
    user?: User;
    session?: UserSession;
}
export interface AppError {
    name: string;
    message: string;
    statusCode: number;
    isOperational: boolean;
}
//# sourceMappingURL=index.d.ts.map