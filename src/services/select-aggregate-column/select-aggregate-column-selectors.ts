import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './select-aggregate-column-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.selectAggregateColumns || initialState;

export const selectSelectAggregateColumns = createSelector([selectDomain], (state) => state.selectAggregateColumns);
export const selectSelectAggregateColumn = createSelector([selectDomain], (state) => state.selectAggregateColumn);
export const selectSelectAggregateColumnFilters = createSelector([selectDomain], (state) => state.filters);
export const selectSelectAggregateColumnIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectSelectAggregateColumnError = createSelector([selectDomain], (state) => state.error);
