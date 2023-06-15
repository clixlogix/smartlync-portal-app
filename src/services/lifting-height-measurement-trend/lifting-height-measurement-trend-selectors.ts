import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './lifting-height-measurement-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.liftingHeightMeasurementTrends || initialState;

export const selectLiftingHeightMeasurementTrends = createSelector(
    [selectDomain],
    (state) => state.liftingHeightMeasurementTrends,
);
export const selectLiftingHeightMeasurementTrend = createSelector(
    [selectDomain],
    (state) => state.liftingHeightMeasurementTrend,
);
export const selectLiftingHeightMeasurementTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectLiftingHeightMeasurementTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectLiftingHeightMeasurementTrendError = createSelector([selectDomain], (state) => state.error);
export const selectLiftingHeightMeasurementTrendFilterValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);
