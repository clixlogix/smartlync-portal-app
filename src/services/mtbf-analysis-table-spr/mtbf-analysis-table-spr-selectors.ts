import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './mtbf-analysis-table-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.mtbfAnalysisTableSprs || initialState;

export const selectMtbfAnalysisTableSprs = createSelector([selectDomain], (state) => state.mtbfAnalysisTableSprs);
export const selectdefaultMtbfAnalysisTableSprs = createSelector([selectDomain], (state) => state.defaultValue);
export const selectMtbfAnalysisTableSpr = createSelector([selectDomain], (state) => state.mtbfAnalysisTableSpr);
export const selectMtbfAnalysisTableSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMtbfAnalysisTableSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMtbfAnalysisTableSprError = createSelector([selectDomain], (state) => state.error);
export const selectMtbfColumnSprs = createSelector([selectDomain], (state) => state.columns);
export const selectMtbfData = createSelector([selectDomain], (state) => state.mtbfData);
