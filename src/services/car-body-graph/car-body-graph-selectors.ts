import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './car-body-graph-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.carBodyGraphs || initialState;

export const selectCarBodyGraphs = createSelector([selectDomain], (state) => state.carBodyGraphs);
export const selectCarBodyGraph = createSelector([selectDomain], (state) => state.carBodyGraph);
export const selectCarBodyGraphFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCarBodyGraphFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectCarBodyGraphIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectCarBodyGraphError = createSelector([selectDomain], (state) => state.error);
