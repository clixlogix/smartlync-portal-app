import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './welding-time-measurement-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.weldingTimeMeasurementTrends || initialState;

export const selectWeldingTimeMeasurementTrends = createSelector(
    [selectDomain],
    (state) => state.weldingTimeMeasurementTrends,
);
export const selectWeldingTimeMeasurementTrend = createSelector(
    [selectDomain],
    (state) => state.weldingTimeMeasurementTrend,
);
export const selectWeldingTimeMeasurementTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectWeldingTimeMeasurementTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectWeldingTimeMeasurementTrendError = createSelector([selectDomain], (state) => state.error);
export const selectWeldingTimeMeasurementTrendFilterValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);
