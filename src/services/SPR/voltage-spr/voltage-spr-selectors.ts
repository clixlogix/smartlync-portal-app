import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './voltage-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.voltageSprs || initialState;

export const selectVoltageSprs = createSelector([selectDomain], (state) => state.voltageSprs);
export const selectVoltageSpr = createSelector([selectDomain], (state) => state.voltageSpr);
export const selectVoltageSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectVoltageSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectVoltageSprError = createSelector([selectDomain], (state) => state.error);
