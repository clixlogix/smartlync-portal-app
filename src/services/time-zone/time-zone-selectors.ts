import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './time-zone-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.timeZones || initialState;

export const selectTimeZones = createSelector([selectDomain], (state) => state.timeZones);
export const selectTimeZone = createSelector([selectDomain], (state) => state.timeZone);
export const selectTimeZoneFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTimeZoneIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTimeZoneError = createSelector([selectDomain], (state) => state.error);
