import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.events || initialState;

export const selectEvents = createSelector([selectDomain], (state) => state.events);
export const selectEvent = createSelector([selectDomain], (state) => state.event);
export const selectEventFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventError = createSelector([selectDomain], (state) => state.error);
