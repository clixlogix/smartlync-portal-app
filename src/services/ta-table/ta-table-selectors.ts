import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './ta-table-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.taTables || initialState;

export const selectTaTables = createSelector([selectDomain], (state) => state.taTables);
export const selectTaTable = createSelector([selectDomain], (state) => state.taTable);
export const selectdefaultTaTables = createSelector([selectDomain], (state) => state.defaultValue);
export const selectTaTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTaTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTaTableError = createSelector([selectDomain], (state) => state.error);
export const selectTaColumns = createSelector([selectDomain], (state) => state.columns);
export const selectTaData = createSelector([selectDomain], (state) => state.taData);
