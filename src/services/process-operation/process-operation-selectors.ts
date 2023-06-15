import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './process-operation-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.operationItems || initialState;

export const selectOperationItems = createSelector([selectDomain], (state) =>
    state.operationItems.filter((row) => !row.hidden),
);
export const selectOperationItem = createSelector([selectDomain], (state) => state.operationItem);
export const selectOperationItemFilters = createSelector([selectDomain], (state) => state.filters);
export const selectOperationItemFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectOperationItemIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectOperationItemError = createSelector([selectDomain], (state) => state.error);
