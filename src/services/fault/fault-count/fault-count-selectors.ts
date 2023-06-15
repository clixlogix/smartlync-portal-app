import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-count-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultCounts || initialState;

export const selectFaultCounts = createSelector([selectDomain], (state) => state.faultCounts);
export const selectTotalFaultCounts = createSelector([selectDomain], (state) => state.totalFaultCounts);
export const selectFaultReports = createSelector([selectDomain], (state) => state.faultReports);
export const selectFaultCountsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultCountsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultCountsError = createSelector([selectDomain], (state) => state.error);
