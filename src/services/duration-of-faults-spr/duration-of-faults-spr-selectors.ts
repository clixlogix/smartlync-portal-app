import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './duration-of-faults-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.durationOfFaultsSprs || initialState;

export const selectDurationOfFaultsSprs = createSelector([selectDomain], (state) => state.durationOfFaultsSprs);
export const selectDurationOfFaultsSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectDurationOfFaultsSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
