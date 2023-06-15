import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './duration-of-faults-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.durationOfFaults || initialState;

export const selectDurationOfFaultss = createSelector([selectDomain], (state) => state.durationOfFaults);
export const selectDurationOfFaults = createSelector([selectDomain], (state) => state.durationOfFault);
export const selectDurationOfFaultsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectDurationOfFaultsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectDurationOfFaultsError = createSelector([selectDomain], (state) => state.error);
