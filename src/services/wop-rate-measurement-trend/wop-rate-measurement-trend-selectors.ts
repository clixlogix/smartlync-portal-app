import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './wop-rate-measurement-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.wopRateMeasurementTrends || initialState;

export const selectWopRateMeasurementTrends = createSelector([selectDomain], (state) => state.wopRateMeasurementTrends);
export const selectWopRateMeasurementTrend = createSelector([selectDomain], (state) => state.wopRateMeasurementTrend);
export const selectWopRateMeasurementTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectWopRateMeasurementTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectWopRateMeasurementTrendError = createSelector([selectDomain], (state) => state.error);
export const selectWopRateCategories = createSelector([selectDomain], (state) => state.categories);
export const selectWopRateGraphData = createSelector([selectDomain], (state) => state.graphData);
