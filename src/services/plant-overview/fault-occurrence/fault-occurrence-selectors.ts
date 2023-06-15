import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-occurrence-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultOccurrences || initialState;

export const selectFaultOccurrences = createSelector([selectDomain], (state) => state.faultOccurrences);
export const selectFaultOccurrencesFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultOccurrencesIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultOccurrencesError = createSelector([selectDomain], (state) => state.error);
