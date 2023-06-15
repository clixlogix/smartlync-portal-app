import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './device-area-graph-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.deviceAreaGraphs || initialState;

export const selectDeviceAreaGraphs = createSelector([selectDomain], (state) => state.deviceAreaGraphs);
export const selectDeviceAreaGraph = createSelector([selectDomain], (state) => state.deviceAreaGraph);
export const selectDeviceAreaGraphFilters = createSelector([selectDomain], (state) => state.filters);
export const selectDeviceAreaGraphIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectDeviceAreaGraphError = createSelector([selectDomain], (state) => state.error);
