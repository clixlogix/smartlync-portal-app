import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './login-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.login || initialState;

export const selectLoginFilters = createSelector([selectDomain], (state) => state.filters);
export const selectLoginIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectLoginError = createSelector([selectDomain], (state) => state.error);
