import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-frequency-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultFrequencys || initialState;

export const selectFaultFrequencys = createSelector([selectDomain], (state) => state.faultFrequencys);
export const selectFaultFrequency = createSelector([selectDomain], (state) => state.faultFrequency);
export const selectFaultFrequencyFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultFrequencyIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultFrequencyError = createSelector([selectDomain], (state) => state.error);
