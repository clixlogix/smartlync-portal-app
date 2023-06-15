import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './variance-analysis-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.varianceAnalysiss || initialState;

export const selectVarianceAnalysiss = createSelector([selectDomain], (state) => state.varianceAnalysiss);
export const selectVarianceAnalysis = createSelector([selectDomain], (state) => state.varianceAnalysis);
export const selectVarianceAnalysisFilters = createSelector([selectDomain], (state) => state.filters);
export const selectVarianceAnalysisIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectVarianceAnalysisError = createSelector([selectDomain], (state) => state.error);
