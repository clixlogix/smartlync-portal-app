import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-rate-per-event-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventRatePerEventSprs || initialState;

export const selectCategories = createSelector([selectDomain], (state) => state.categories);
export const selectEventRatePerEventSprs = createSelector([selectDomain], (state) => state.eventRatePerEventSprs);
export const selectEventRatePerEventSpr = createSelector([selectDomain], (state) => state.eventRatePerEventSpr);
export const selectEventRatePerEventSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventRatePerEventSprFiltersValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventRatePerEventSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventRatePerEventSprError = createSelector([selectDomain], (state) => state.error);
