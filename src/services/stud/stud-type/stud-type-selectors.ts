import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './stud-type-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.studTypes || initialState;

export const selectStudTypes = createSelector([selectDomain], (state) => state.studTypes);
export const selectStudTypesFilters = createSelector([selectDomain], (state) => state.filters);
export const selectStudTypesIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectStudTypesError = createSelector([selectDomain], (state) => state.error);
