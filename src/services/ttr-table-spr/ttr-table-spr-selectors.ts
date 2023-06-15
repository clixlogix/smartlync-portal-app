import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './ttr-table-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.ttrTableSprs || initialState;

export const selectTtrTableSprs = createSelector([selectDomain], (state) => state.ttrTableSprs);
export const selectdefaultTtrTableSprs = createSelector([selectDomain], (state) => state.defaultValue);
export const selectTtrTableSpr = createSelector([selectDomain], (state) => state.ttrTableSpr);
export const selectTtrTableSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTtrTableSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTtrTableSprError = createSelector([selectDomain], (state) => state.error);
export const selectTtrColumns = createSelector([selectDomain], (state) => state.columns);
export const selectTtrData = createSelector([selectDomain], (state) => state.ttrData);
