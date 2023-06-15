import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-fault-frequency-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantFaultFrequencySprs || initialState;

export const selectPlantFaultFrequencySprs = createSelector([selectDomain], (state) => state.plantFaultFrequencySprs);
export const selectPlantFaultFrequencySpr = createSelector([selectDomain], (state) => state.plantFaultFrequencySpr);
export const selectPlantFaultFrequencySprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantFaultFrequencySprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantFaultFrequencySprError = createSelector([selectDomain], (state) => state.error);
