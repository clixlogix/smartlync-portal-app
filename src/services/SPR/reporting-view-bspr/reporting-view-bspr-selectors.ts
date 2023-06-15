import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './reporting-view-bspr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.reportingViewBsprs || initialState;

export const selectReportingViewBsprs = createSelector([selectDomain], (state) => state.faultCounts);
export const selectReportingViewBspr = createSelector([selectDomain], (state) => state.totalFaultCounts);
export const selectReportingViewBsprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectReportingViewBsprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectReportingViewBsprError = createSelector([selectDomain], (state) => state.error);
