import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './ta-analysis-table-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.taAnalysisTableSprs || initialState;

export const selectTaAnalysisTablesSpr = createSelector([selectDomain], (state) => state.taAnalysisTablesSpr);
export const selectTaAnalysisTableSpr = createSelector([selectDomain], (state) => state.taAnalysisTableSpr);
export const selectTaAnalysisTableFiltersSpr = createSelector([selectDomain], (state) => state.filters);
export const selectTaAnalysisTableFilterValuesSpr = createSelector([selectDomain], (state) => state.filterValues);
export const selectTaAnalysisTableIsLoadingSpr = createSelector([selectDomain], (state) => state.isLoading);
export const selectTaAnalysisTableErrorSpr = createSelector([selectDomain], (state) => state.error);
