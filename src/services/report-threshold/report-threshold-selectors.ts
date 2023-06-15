import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './report-threshold-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.reportThresholds || initialState;

export const selectReportThresholds = createSelector([selectDomain], (state) => state.reportThresholds);
export const selectReportThreshold = createSelector([selectDomain], (state) => state.reportThreshold);
export const selectReportThresholdFilters = createSelector([selectDomain], (state) => state.filters);
export const selectReportThresholdIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectReportThresholdError = createSelector([selectDomain], (state) => state.error);
