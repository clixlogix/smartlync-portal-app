import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './mtbf-analysis-table-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.mtbfAnalysisTables || initialState;

export const selectMtbfAnalysisTables = createSelector([selectDomain], (state) => state.mtbfAnalysisTables);
export const selectdefaultMtbfAnalysisTables = createSelector([selectDomain], (state) => state.defaultValue);
export const selectMtbfAnalysisTable = createSelector([selectDomain], (state) => state.mtbfAnalysisTable);
export const selectMtbfAnalysisTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMtbfAnalysisTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMtbfAnalysisTableError = createSelector([selectDomain], (state) => state.error);
export const selectMtbfColumns = createSelector([selectDomain], (state) => state.columns);
export const selectMtbfData = createSelector([selectDomain], (state) => state.mtbfData);
