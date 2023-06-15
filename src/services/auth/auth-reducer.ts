/*
 * Msg Slice
 *
 * Here we define:
 * - The shape of our auth container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { Auth, AuthLogin } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { AuthState } from '.';
import Constants from 'constants/index';

// The initial state of auth

export const initialState: AuthState = {
    isAuthenticated: false,
    loginError: undefined,
    isLoginLoading: false,
    auth: {},
    data: undefined,
};

/*
 *
 *
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        auth(state, action: PayloadAction<Auth>) {
            const { token, jwtToken, ...user } = action.payload;

            localStorage.setItem(Constants.storageKeys.authToken, JSON.stringify(token));
            localStorage.setItem(Constants.storageKeys.userDetails, JSON.stringify(user));
            localStorage.setItem(Constants.storageKeys.jwtToken, JSON.stringify({ jwtToken }));

            state.data = action.payload;
            state.isAuthenticated = true;
            // window.location.href = '/';
        },
        profile(state) { },
        setProfile(state, action: PayloadAction<Auth>) {
            state.data = action.payload;
            state.isAuthenticated = true;

            localStorage.setItem(Constants.storageKeys.userDetails, JSON.stringify({ user: state.data }));
        },
        logout(state) {
            localStorage.removeItem(Constants.storageKeys.authToken);
            localStorage.removeItem(Constants.storageKeys.userDetails);
            localStorage.removeItem(Constants.storageKeys.jwtToken);
            localStorage.removeItem('plantId'); // Remove Plant ID from localstorage when user logs out

            state.isAuthenticated = false;
            // window.location.href = '/';
        },
        authenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        error(state, action: PayloadAction<CustomError>) {
            state.loginError = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoginLoading = action.payload;
        },
        authLogin(state, action: PayloadAction<AuthLogin>) {
            state.auth = action.payload;
        },
        clear(state) {
            state = { ...initialState };
        },
    },
});

export const { actions, reducer, name: auth } = authSlice;
