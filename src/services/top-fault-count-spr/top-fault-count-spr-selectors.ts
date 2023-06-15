import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './top-fault-count-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.topFaultCountSprs || initialState;

export const selectTopFaultCountsSprColumns = createSelector([selectDomain], (state) => state.topFaultCountSprColumns);
export const selectTopFaultCountSprs = createSelector([selectDomain], (state) => state.topFaultCountSprs);
export const selectTopFaultCountSpr = createSelector([selectDomain], (state) => state.topFaultCountSpr);
export const selectTopFaultCountSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTopFaultCountSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTopFaultCountSprError = createSelector([selectDomain], (state) => state.error);
