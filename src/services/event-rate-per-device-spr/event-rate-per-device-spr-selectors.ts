import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-rate-per-device-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventRatePerDeviceSprs || initialState;

export const selectEventPerDeviceSprCategories = createSelector([selectDomain], (state) => state.categories);
export const selectEventRatePerDeviceSprs = createSelector([selectDomain], (state) => state.eventRatePerDeviceSprs);
export const selectEventRatePerDeviceSpr = createSelector([selectDomain], (state) => state.eventRatePerDeviceSpr);
export const selectEventRatePerDeviceSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventRatePerDeviceSprFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventRatePerDeviceSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventRatePerDeviceSprError = createSelector([selectDomain], (state) => state.error);
