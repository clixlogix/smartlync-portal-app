import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-device-by-duration-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantDeviceByDurations || initialState;

export const selectPlantDeviceByDurations = createSelector([selectDomain], (state) => state.plantDeviceByDurations);
export const selectPlantDeviceByDuration = createSelector([selectDomain], (state) => state.plantDeviceByDuration);
export const selectPlantDeviceByDurationFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantDeviceByDurationIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantDeviceByDurationError = createSelector([selectDomain], (state) => state.error);
