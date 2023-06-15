import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-fault-by-stud-type-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantFaultByStudTypeSprs || initialState;

export const selectPlantFaultByStudTypeSprs = createSelector([selectDomain], (state) => state.plantFaultByStudTypeSprs);
export const selectPlantFaultByStudTypeSpr = createSelector([selectDomain], (state) => state.plantFaultByStudTypeSpr);
export const selectPlantFaultByStudTypeSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantFaultByStudTypeSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantFaultByStudTypeSprError = createSelector([selectDomain], (state) => state.error);
