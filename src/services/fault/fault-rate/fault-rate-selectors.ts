import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-rate-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultRates || initialState;

export const selectFaultRates = createSelector([selectDomain], (state) => state.faultRates);
export const selectFaultRatesFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultRatesFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectFaultRatesIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultRatesError = createSelector([selectDomain], (state) => state.error);
