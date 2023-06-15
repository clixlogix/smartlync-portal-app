import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './probability-density-function-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.probabilityDensityFunctions || initialState;

export const selectProbabilityDensityFunctions = createSelector(
    [selectDomain],
    (state) => state.probabilityDensityFunctions,
);
export const selectProbabilityDensityFunction = createSelector(
    [selectDomain],
    (state) => state.probabilityDensityFunction,
);
export const selectProbabilityDensityFunctionFilters = createSelector([selectDomain], (state) => state.filters);
export const selectProbabilityDensityFunctionIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectProbabilityDensityFunctionError = createSelector([selectDomain], (state) => state.error);
