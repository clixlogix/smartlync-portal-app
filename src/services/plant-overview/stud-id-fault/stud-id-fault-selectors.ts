import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './stud-id-fault-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.studIdFaults || initialState;

export const selectStudIdFaults = createSelector([selectDomain], (state) => state.studIdFaults);
export const selectStudIdFaultsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectStudIdFaultsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectStudIdFaultsError = createSelector([selectDomain], (state) => state.error);
