import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './auth-reducer';
import { User } from 'models';
import Constants from 'constants/index';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.auth || initialState;

export const selectAuth = createSelector([selectDomain], (auth) => auth.data);

export const selectLogin = createSelector([selectDomain], (auth) => auth.auth);

export const selectRoles = createSelector([selectDomain], (auth) => auth?.data?.user?.roles || []);

export const selectLoggedIn = createSelector([selectDomain], (auth) => {
    const { jwtToken } = JSON.parse(localStorage.getItem(Constants.storageKeys.jwtToken) || '{}');

    return !!jwtToken;
});

export const selectLoggedInUserDetails = createSelector(
    [selectDomain],
    (auth): User => {
        const details = localStorage.getItem(Constants.storageKeys.userDetails);
        const { user } = !!details ? JSON.parse(details) : { user: undefined };
        return user;
    },
);

export const selectAuthToken = createSelector([selectDomain], (auth) => {
    const token = localStorage.getItem(Constants.storageKeys.authToken);
    return token;
});

export const selectAuthLoading = createSelector([selectDomain], (auth) => auth.isLoginLoading);

export const selectAuthError = createSelector([selectDomain], (auth) => auth.loginError);

export const selectVersion = createSelector([selectDomain], (auth) => {
    JSON.parse(localStorage.getItem(Constants.storageKeys.version) || '{}');
});
