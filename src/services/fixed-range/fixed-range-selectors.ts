import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fixed-range-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.fixedRanges || initialState;

export const selectFixedRanges = createSelector([selectDomain], (state) => state.fixedRanges);
export const selectInitialFixedRange = createSelector([selectDomain], (state) => state.initialFixedRange);
export const selectFixedRangeFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFixedRangeIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFixedRangeError = createSelector([selectDomain], (state) => state.error);
