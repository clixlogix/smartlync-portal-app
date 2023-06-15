import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './mttr-table-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.mttrTables || initialState;

export const selectMttrTables = createSelector([selectDomain], (state) => state.mttrTables);
export const selectdefaultMttrTables = createSelector([selectDomain], (state) => state.defaultValue);
export const selectMttrTable = createSelector([selectDomain], (state) => state.mttrTable);
export const selectMttrTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMttrTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMttrTableError = createSelector([selectDomain], (state) => state.error);
export const selectMttrColumns = createSelector([selectDomain], (state) => state.columns);
export const selectMttrData = createSelector([selectDomain], (state) => state.mttrData);
