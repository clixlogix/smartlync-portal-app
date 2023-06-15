import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './penetration-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.penetrationSprs || initialState;

export const selectPenetrationSprs = createSelector([selectDomain], (state) => state.penetrationSprs);
export const selectPenetrationSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPenetrationSprFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectPenetrationSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPenetrationSprError = createSelector([selectDomain], (state) => state.error);
