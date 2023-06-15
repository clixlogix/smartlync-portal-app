import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-fault-by-occurence-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantFaultByOccurenceSprs || initialState;

export const selectPlantFaultByOccurenceSprs = createSelector(
    [selectDomain],
    (state) => state.plantFaultByOccurenceSprs,
);
export const selectPlantFaultByOccurenceSpr = createSelector([selectDomain], (state) => state.plantFaultByOccurenceSpr);
export const selectPlantFaultByOccurenceSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantFaultByOccurenceSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantFaultByOccurenceSprError = createSelector([selectDomain], (state) => state.error);
