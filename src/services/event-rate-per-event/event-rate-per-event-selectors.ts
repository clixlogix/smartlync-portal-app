import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-rate-per-event-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventRatePerEvents || initialState;

export const selectCategories = createSelector([selectDomain], (state) => state.categories);
export const selectEventRatePerEvents = createSelector([selectDomain], (state) => state.eventRatePerEvents);
export const selectEventRatePerEvent = createSelector([selectDomain], (state) => state.eventRatePerEvent);
export const selectEventRatePerEventFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventRatePerEventFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventRatePerEventIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventRatePerEventError = createSelector([selectDomain], (state) => state.error);
