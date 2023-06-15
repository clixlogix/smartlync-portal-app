import { Auth, AuthLogin } from 'models';
import { CustomError } from 'utils/error';

/* --- STATE --- */
export interface AuthState {
    readonly isAuthenticated: boolean;
    readonly loginError?: CustomError;
    readonly isLoginLoading: boolean;
    auth?: AuthLogin;
    data?: Auth;
}

export type AuthToken = string;
