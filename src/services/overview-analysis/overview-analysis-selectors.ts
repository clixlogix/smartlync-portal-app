import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './overview-analysis-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.overviewAnalysiss || initialState;

export const selectOverviewAnalysiss = createSelector([selectDomain], (state) => state.overviewAnalysiss);
export const selectOverviewAnalysis = createSelector([selectDomain], (state) => state.overviewAnalysis);
export const selectOverviewAnalysisFilters = createSelector([selectDomain], (state) => state.filters);
export const selectOverviewAnalysisIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectOverviewAnalysisError = createSelector([selectDomain], (state) => state.error);
