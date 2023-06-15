import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-report-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultReports || initialState;

export const selectFaultReports = createSelector([selectDomain], (state) => state.faultReports);
export const selectFaultReport = createSelector([selectDomain], (state) => state.faultReport);
export const selectFaultReportFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultReportIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultReportError = createSelector([selectDomain], (state) => state.error);
