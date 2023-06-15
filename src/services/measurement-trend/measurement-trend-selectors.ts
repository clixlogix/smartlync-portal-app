import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './measurement-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.measurementTrends || initialState;

export const selectMeasurementTrends = createSelector([selectDomain], (state) => state.measurementTrends);
export const selectMeasurementTrend = createSelector([selectDomain], (state) => state.measurementTrend);
export const selectMeasurementTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMeasurementTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMeasurementTrendError = createSelector([selectDomain], (state) => state.error);
