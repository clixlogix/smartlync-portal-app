import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './ttr-table-reducer';

const selectDomain = (state: RootState) => state.ttrTables || initialState;

export const selectTtrTables = createSelector([selectDomain], (state) => state.ttrTables);
export const selectdefaultTtrTables = createSelector([selectDomain], (state) => state.defaultValue);
export const selectTtrTable = createSelector([selectDomain], (state) => state.ttrTable);
export const selectTtrTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTtrTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTtrTableError = createSelector([selectDomain], (state) => state.error);
export const selectTtrColumns = createSelector([selectDomain], (state) => state.columns);
export const selectTtrData = createSelector([selectDomain], (state) => state.ttrData);
