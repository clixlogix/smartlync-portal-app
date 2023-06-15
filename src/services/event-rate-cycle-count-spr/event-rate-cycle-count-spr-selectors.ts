import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-rate-cycle-count-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventRateCycleCountSprs || initialState;

export const selectEventRateCycleCountSprs = createSelector([selectDomain], (state) => state.eventRateCycleCountSprs);
export const selectEventRateCycleCountSpr = createSelector([selectDomain], (state) => state.eventRateCycleCountSpr);
export const selectEventRateCycleCountSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventRateCycleCountSprFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventRateCycleCountSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventRateCycleCountSprError = createSelector([selectDomain], (state) => state.error);
