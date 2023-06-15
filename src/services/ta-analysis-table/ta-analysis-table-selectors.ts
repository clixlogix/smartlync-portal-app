import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './ta-analysis-table-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.taAnalysisTables || initialState;

export const selectTaAnalysisTables = createSelector([selectDomain], (state) => state.taAnalysisTables);
export const selectTaAnalysisTable = createSelector([selectDomain], (state) => state.taAnalysisTable);
export const selectTaAnalysisTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTaAnalysisTableFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectTaAnalysisTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTaAnalysisTableError = createSelector([selectDomain], (state) => state.error);
