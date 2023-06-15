import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './daily-fault-trends-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.dailyFaultTrends || initialState;

export const selectDailyFaultTrends = createSelector([selectDomain], (state) => state.dailyFaultTrends);
export const selectDailyFaultTrend = createSelector([selectDomain], (state) => state.dailyFaultTrend);
export const selectDailyFaultTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectDailyFaultTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectDailyFaultTrendError = createSelector([selectDomain], (state) => state.error);
