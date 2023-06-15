import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './device-name-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.deviceNames || initialState;

export const selectDeviceNames = createSelector([selectDomain], (state) => state.deviceNames);
export const selectDeviceNamesFilters = createSelector([selectDomain], (state) => state.filters);
export const selectDeviceNamesIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectDeviceNamesError = createSelector([selectDomain], (state) => state.error);
