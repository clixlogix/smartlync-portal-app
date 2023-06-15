import { CustomError } from 'utils/error';
import { Login, Auth } from 'models';

/* --- STATE --- */
export interface LoginState {
    readonly isAuthenticated: boolean;
    filters: Login;

    error: CustomError | undefined;
    isLoading: boolean;
    data?: Auth;
}

export default LoginState;
