import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-duration-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultDurations || initialState;

export const selectFaultDurations = createSelector([selectDomain], (state) => state.faultDurations);
export const selectFaultDuration = createSelector([selectDomain], (state) => state.faultDuration);
export const selectFaultDurationFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultDurationIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultDurationError = createSelector([selectDomain], (state) => state.error);
