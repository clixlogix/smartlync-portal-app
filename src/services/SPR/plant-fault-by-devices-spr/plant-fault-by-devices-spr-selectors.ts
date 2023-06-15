import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-fault-by-devices-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantFaultByDevicesSprs || initialState;

export const selectPlantFaultByDevicesSprs = createSelector([selectDomain], (state) => state.plantFaultByDevicesSprs);
export const selectPlantFaultByDevicesSpr = createSelector([selectDomain], (state) => state.plantFaultByDevicesSpr);
export const selectPlantFaultByDevicesSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantFaultByDevicesSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantFaultByDevicesSprError = createSelector([selectDomain], (state) => state.error);
