import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './stud-projection-measurement-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.studProjectionMeasurementTrends || initialState;

export const selectStudProjectionMeasurementTrends = createSelector(
    [selectDomain],
    (state) => state.studProjectionMeasurementTrends,
);
export const selectStudProjectionMeasurementTrend = createSelector(
    [selectDomain],
    (state) => state.studProjectionMeasurementTrend,
);
export const selectStudProjectionMeasurementTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectStudProjectionMeasurementTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectStudProjectionMeasurementTrendError = createSelector([selectDomain], (state) => state.error);
export const selectStudProjectionMeasurementTrendFilterValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);
