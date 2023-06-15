import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './mtbf-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.mtbfs || initialState;

export const selectMtbfs = createSelector([selectDomain], (state) => state.mtbfs);
export const selectMtbfsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMtbfsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMtbfsError = createSelector([selectDomain], (state) => state.error);
