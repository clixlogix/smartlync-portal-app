import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fleet-expand-device-table-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.fleetExpandDeviceTables || initialState;

export const selectFleetExpandDeviceTables = createSelector([selectDomain], (state) => state.fleetExpandDeviceTables);
export const selectFleetExpandDeviceTable = createSelector([selectDomain], (state) => state.fleetExpandDeviceTable);
export const selectFleetExpandDeviceTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFleetExpandDeviceTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFleetExpandDeviceTableError = createSelector([selectDomain], (state) => state.error);
