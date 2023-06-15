import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-fault-by-duration-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantFaultByDurationSprs || initialState;

export const selectPlantFaultByDurationSprs = createSelector([selectDomain], (state) => state.plantFaultByDurationSprs);
export const selectPlantFaultByDurationSpr = createSelector([selectDomain], (state) => state.plantFaultByDurationSpr);
export const selectPlantFaultByDurationSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantFaultByDurationSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantFaultByDurationSprError = createSelector([selectDomain], (state) => state.error);
