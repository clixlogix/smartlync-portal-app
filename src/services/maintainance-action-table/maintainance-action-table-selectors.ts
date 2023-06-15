import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './maintainance-action-table-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.maintainanceActionTables || initialState;

export const selectMaintainanceActionTables = createSelector([selectDomain], (state) => state.maintainanceActionTables);
export const selectMaintainanceActionTable = createSelector([selectDomain], (state) => state.maintainanceActionTable);
export const selectMaintainanceActionTableFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMaintainanceActionTableIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMaintainanceActionTableError = createSelector([selectDomain], (state) => state.error);
