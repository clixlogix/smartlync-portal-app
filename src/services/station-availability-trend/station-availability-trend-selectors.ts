import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './station-availability-trend-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.stationAvailabilityTrends || initialState;

export const selectStationAvailabilityTrends = createSelector(
    [selectDomain],
    (state) => state.stationAvailabilityTrends,
);
export const selectStationAvailabilityTrend = createSelector([selectDomain], (state) => state.stationAvailabilityTrend);
export const selectStationAvailabilityTrendFilters = createSelector([selectDomain], (state) => state.filters);
export const selectStationAvailabilityTrendIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectStationAvailabilityTrendError = createSelector([selectDomain], (state) => state.error);
