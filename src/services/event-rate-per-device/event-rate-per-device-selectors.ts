import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-rate-per-device-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventRatePerDevices || initialState;

export const selectEventPerDeviceCategories = createSelector([selectDomain], (state) => state.categories);
export const selectEventRatePerDevices = createSelector([selectDomain], (state) => state.eventRatePerDevices);
export const selectEventRatePerDevice = createSelector([selectDomain], (state) => state.eventRatePerDevice);
export const selectEventRatePerDeviceFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventRatePerDeviceFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventRatePerDeviceIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventRatePerDeviceError = createSelector([selectDomain], (state) => state.error);
