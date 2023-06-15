import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './total-cycle-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.totalCycles || initialState;

export const selectTotalCycles = createSelector([selectDomain], (state) => state.totalCycle);
export const selectTotalCyclesFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTotalCyclesIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTotalCyclesError = createSelector([selectDomain], (state) => state.error);
