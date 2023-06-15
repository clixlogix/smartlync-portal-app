import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './top-fault-count-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.topFaultCounts || initialState;

export const selectTopFaultCountsColumns = createSelector([selectDomain], (state) => state.topFaultCountsColumns);
export const selectTopFaultCounts = createSelector([selectDomain], (state) => state.topFaultCounts);
export const selectTopFaultCount = createSelector([selectDomain], (state) => state.topFaultCount);
export const selectTopFaultCountFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTopFaultCountIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTopFaultCountError = createSelector([selectDomain], (state) => state.error);
