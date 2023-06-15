import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './mttr-table-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.mttrTableSors || initialState;

export const selectMttrTableSprs = createSelector([selectDomain], (state) => state.mttrTableSprs);
export const selectdefaultMttrTableSprs = createSelector([selectDomain], (state) => state.defaultValue);
export const selectMttrTableSpr = createSelector([selectDomain], (state) => state.mttrTableSpr);
export const selectMttrTableSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMttrTableSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMttrTableSprError = createSelector([selectDomain], (state) => state.error);
export const selectMttrColumns = createSelector([selectDomain], (state) => state.columns);
export const selectMttrData = createSelector([selectDomain], (state) => state.mttrData);
