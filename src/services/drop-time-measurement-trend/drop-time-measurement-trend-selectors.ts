import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './drop-time-measurement-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.dropTimeMeasurementTrends || initialState;

export const selectDropTimeMeasurementTrends = createSelector(
    [selectDomain],
    (state) => state.dropTimeMeasurementTrends,
);
export const selectDropTimeMeasurementTrend = createSelector([selectDomain], (state) => state.dropTimeMeasurementTrend);
export const selectDropTimeMeasurementTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectDropTimeMeasurementTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectDropTimeMeasurementTrendError = createSelector([selectDomain], (state) => state.error);
export const selectDropTimeMeasurementTrendFilterValues = createSelector([selectDomain], (state) => state.filterValues);
