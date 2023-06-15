import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './reporting-view-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.reportingViewSprs || initialState;

export const selectReportingViewSprs = createSelector([selectDomain], (state) => state.reportingViewSprs);
export const selectReportingViewSpr = createSelector([selectDomain], (state) => state.reportingViewSpr);
export const selectReportingViewSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectReportingViewSprFilterValues = createSelector([selectDomain], (state) => state.filterValues);

export const selectReportingViewSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectReportingViewSprError = createSelector([selectDomain], (state) => state.error);
