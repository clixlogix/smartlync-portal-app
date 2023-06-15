import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './weld-time-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.weldTimes || initialState;

export const selectWeldTimes = createSelector([selectDomain], (state) => state.weldTimes);
export const selectWeldTimeFilters = createSelector([selectDomain], (state) => state.filters);
export const selectWeldFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectWeldTimeIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectWeldTimeError = createSelector([selectDomain], (state) => state.error);
