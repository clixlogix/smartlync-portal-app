import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './faults-per-device-histogram-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultsPerDeviceHistogramSprs || initialState;

export const selectFaultsPerDeviceHistogramSprs = createSelector(
    [selectDomain],
    (state) => state.faultsPerDeviceHistogramSprs,
);
export const selectFaultsPerDeviceHistogramSpr = createSelector(
    [selectDomain],
    (state) => state.faultsPerDeviceHistogramSpr,
);
export const selectFaultsPerDeviceHistogramSprCategories = createSelector([selectDomain], (state) => state.categories);

export const selectFaultsPerDeviceHistogramSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultsPerDeviceHistogramSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultsPerDeviceHistogramSprError = createSelector([selectDomain], (state) => state.error);
