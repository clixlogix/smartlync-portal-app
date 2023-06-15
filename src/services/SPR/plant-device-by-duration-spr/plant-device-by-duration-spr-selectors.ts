import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-device-by-duration-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantDeviceByDurationSprs || initialState;

export const selectPlantDeviceByDurationSprs = createSelector(
    [selectDomain],
    (state) => state.plantDeviceByDurationSprs,
);
export const selectPlantDeviceByDurationSpr = createSelector([selectDomain], (state) => state.plantDeviceByDurationSpr);
export const selectPlantDeviceByDurationSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantDeviceByDurationSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantDeviceByDurationSprError = createSelector([selectDomain], (state) => state.error);
