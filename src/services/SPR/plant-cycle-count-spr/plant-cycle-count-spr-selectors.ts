import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-cycle-count-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantCycleCountSprs || initialState;

export const selectPlantCycleCountSprs = createSelector([selectDomain], (state) => state.plantCycleCountSprs);
export const selectPlantCycleCountSpr = createSelector([selectDomain], (state) => state.plantCycleCountSpr);
export const selectPlantCycleCountSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantCycleCountSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantCycleCountSprError = createSelector([selectDomain], (state) => state.error);
