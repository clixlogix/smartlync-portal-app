import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './penetration-measurement-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.penetrationMeasurementTrends || initialState;

export const selectPenetrationMeasurementTrends = createSelector(
    [selectDomain],
    (state) => state.penetrationMeasurementTrends,
);
export const selectPenetrationMeasurementTrend = createSelector(
    [selectDomain],
    (state) => state.penetrationMeasurementTrend,
);
export const selectPenetrationMeasurementTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPenetrationMeasurementTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPenetrationMeasurementTrendError = createSelector([selectDomain], (state) => state.error);
export const selectPenetrationMeasurementTrendFilterValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);
