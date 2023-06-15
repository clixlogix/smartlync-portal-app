import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-desc-frequency-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventDescFrequencys || initialState;

export const selectEventDescFrequencys = createSelector([selectDomain], (state) => state.eventDescFrequencys);
export const selectEventDescFrequency = createSelector([selectDomain], (state) => state.eventDescFrequency);
export const selectEventDescGraphFrequency = createSelector([selectDomain], (state) => state.eventDescGraphFrequency);
export const selectEventDescFrequencyFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventDescFrequencyFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventDescFrequencyIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventDescFrequencyError = createSelector([selectDomain], (state) => state.error);
