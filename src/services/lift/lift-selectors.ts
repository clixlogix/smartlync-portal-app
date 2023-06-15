import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './lift-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.lifts || initialState;

export const selectLifts = createSelector([selectDomain], (state) => state.lifts);
export const selectLiftFilters = createSelector([selectDomain], (state) => state.filters);
export const selectLiftFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectLiftIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectLiftError = createSelector([selectDomain], (state) => state.error);
