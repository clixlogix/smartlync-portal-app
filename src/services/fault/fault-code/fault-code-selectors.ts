import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-code-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultCodes || initialState;

export const selectFaultCodes = createSelector([selectDomain], (state) => state.faultCodes);
export const selectFaultCodesFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultCodesIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultCodesError = createSelector([selectDomain], (state) => state.error);
