import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './system-fault-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.systemFaults || initialState;

export const selectSystemFaults = createSelector([selectDomain], (state) => state.systemFaults);
export const selectSystemFaultsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectSystemFaultsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectSystemFaultsError = createSelector([selectDomain], (state) => state.error);
