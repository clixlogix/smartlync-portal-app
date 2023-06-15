import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './time-zone-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.timeZoneSprs || initialState;

export const selectTimeZoneSprs = createSelector([selectDomain], (state) => state.timeZoneSprs);
// export const selectTimeZoneSpr = createSelector([selectDomain], (state) => state.timeZoneSpr);
export const selectTimeZoneSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTimeZoneSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTimeZoneSprError = createSelector([selectDomain], (state) => state.error);
