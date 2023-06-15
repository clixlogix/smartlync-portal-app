import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './stud-id-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.studIds || initialState;

export const selectStudIds = createSelector([selectDomain], (state) => state.studIds);
export const selectStudIdsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectStudIdsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectStudIdsError = createSelector([selectDomain], (state) => state.error);
