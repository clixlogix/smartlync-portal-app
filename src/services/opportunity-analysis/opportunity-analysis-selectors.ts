import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './opportunity-analysis-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.opportunityAnalysiss || initialState;

export const selectOpportunityAnalysiss = createSelector([selectDomain], (state) => state.opportunityAnalysiss);
export const selectOpportunityAnalysis = createSelector([selectDomain], (state) => state.opportunityAnalysis);
export const selectOpportunityAnalysisFilters = createSelector([selectDomain], (state) => state.filters);
export const selectOpportunityAnalysisIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectOpportunityAnalysisError = createSelector([selectDomain], (state) => state.error);
