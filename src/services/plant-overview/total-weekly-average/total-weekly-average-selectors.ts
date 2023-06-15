import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './total-weekly-average-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.totalWeeklyAverages || initialState;

export const selectTotalWeeklyAverages = createSelector([selectDomain], (state) => state.totalWeeklyAverages);
export const selectTotalWeeklyAverage = createSelector([selectDomain], (state) => state.totalWeeklyAverage);
export const selectTotalWeeklyAverageFiltersValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectTotalWeeklyAverageFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTotalWeeklyAverageIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTotalWeeklyAverageError = createSelector([selectDomain], (state) => state.error);
