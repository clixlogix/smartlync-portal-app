import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-rate-measurement-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultRateMeasurementTrends || initialState;

export const selectFaultRateMeasurementTrends = createSelector(
    [selectDomain],
    (state) => state.faultRateMeasurementTrends,
);
export const selectFaultRateMeasurementTrend = createSelector(
    [selectDomain],
    (state) => state.faultRateMeasurementTrend,
);
export const selectFaultRateMeasurementTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultRateMeasurementTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultRateMeasurementTrendError = createSelector([selectDomain], (state) => state.error);
export const selectFaultRateCategories = createSelector([selectDomain], (state) => state.categories);
export const selectFaultRateGraphData = createSelector([selectDomain], (state) => state.graphData);
