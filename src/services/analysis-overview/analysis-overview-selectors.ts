import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './analysis-overview-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.analysisOverviews || initialState;

export const selectAnalysisOverviews = createSelector([selectDomain], (state) => state.analysisOverviews);
export const selectAnalysisOverview = createSelector([selectDomain], (state) => state.analysisOverview);
export const selectAnalysisOverviewFilters = createSelector([selectDomain], (state) => state.filters);
export const selectAnalysisOverviewIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectAnalysisOverviewError = createSelector([selectDomain], (state) => state.error);
