import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './sa-table-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.saTables || initialState;

export const selectSaTables = createSelector([selectDomain], (state) => state.saTables);
export const selectSaTable = createSelector([selectDomain], (state) => state.saTable);
export const selectSaTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectSaTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectSaTableError = createSelector([selectDomain], (state) => state.error);
