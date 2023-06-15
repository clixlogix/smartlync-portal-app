import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './car-body-table-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.carBodyTables || initialState;

export const selectCarBodyTables = createSelector([selectDomain], (state) => state.carBodyTables);
export const selectCarBodyTable = createSelector([selectDomain], (state) => state.carBodyTable);
export const selectCarBodyTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCarBodyTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectCarBodyTableError = createSelector([selectDomain], (state) => state.error);
export const selectCarBodyTableColumns = createSelector([selectDomain], (state) => state.columns);
