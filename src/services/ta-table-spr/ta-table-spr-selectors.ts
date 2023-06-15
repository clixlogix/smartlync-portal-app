import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './ta-table-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.taTableSprs || initialState;

export const selectTaTableSprs = createSelector([selectDomain], (state) => state.taTableSprs);
export const selectTaTableSpr = createSelector([selectDomain], (state) => state.taTableSpr);
export const selectdefaultTaTables = createSelector([selectDomain], (state) => state.defaultValue);
export const selectTaTableSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectTaTableSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectTaTableSprError = createSelector([selectDomain], (state) => state.error);
export const selectTaColumns = createSelector([selectDomain], (state) => state.columns);
export const selectTaData = createSelector([selectDomain], (state) => state.taData);
