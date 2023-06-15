import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './station-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.stations || initialState;

export const selectStations = createSelector([selectDomain], (state) => state.stations);
export const selectStationsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectStationsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectStationsError = createSelector([selectDomain], (state) => state.error);
