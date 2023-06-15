import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './faults-per-device-histogram-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultsPerDeviceHistograms || initialState;

export const selectFaultsPerDeviceHistograms = createSelector(
    [selectDomain],
    (state) => state.faultsPerDeviceHistograms,
);
export const selectFaultsPerDeviceHistogram = createSelector([selectDomain], (state) => state.faultsPerDeviceHistogram);
export const selectFaultsPerDeviceHistogramFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultsPerDeviceHistogramCategories = createSelector([selectDomain], (state) => state.categories);
export const selectFaultsPerDeviceHistogramIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultsPerDeviceHistogramError = createSelector([selectDomain], (state) => state.error);
