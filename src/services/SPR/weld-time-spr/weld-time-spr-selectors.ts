import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './weld-time-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.weldTimeSprs || initialState;

export const selectWeldTimeSprs = createSelector([selectDomain], (state) => state.weldTimeSprs);
export const selectWeldTimeSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectWeldTimeSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectWeldTimeSprError = createSelector([selectDomain], (state) => state.error);
