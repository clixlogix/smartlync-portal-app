import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './line-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.lines || initialState;

export const selectLines = createSelector([selectDomain], (state) => state.lines);
export const selectLinesFilters = createSelector([selectDomain], (state) => state.filters);
export const selectLinesIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectLinesError = createSelector([selectDomain], (state) => state.error);
