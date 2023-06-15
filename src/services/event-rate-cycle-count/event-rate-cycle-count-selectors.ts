import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-rate-cycle-count-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventRateCycleCounts || initialState;

export const selectEventRateCycleCounts = createSelector([selectDomain], (state) => state.eventRateCycleCounts);
export const selectEventRateCycleCount = createSelector([selectDomain], (state) => state.eventRateCycleCount);
export const selectEventRateCycleCountFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventRateCycleCountFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventRateCycleCountIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventRateCycleCountError = createSelector([selectDomain], (state) => state.error);
