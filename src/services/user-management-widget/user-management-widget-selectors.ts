import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './user-management-widget-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.userManagementWidgets || initialState;

export const selectUserManagementWidgets = createSelector([selectDomain], (state) => state.userManagementWidgets);
export const selectUserManagementWidget = createSelector([selectDomain], (state) => state.userManagementWidget);
export const selectUserManagementWidgetFilters = createSelector([selectDomain], (state) => state.filters);
export const selectUserManagementWidgetIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectUserManagementWidgetError = createSelector([selectDomain], (state) => state.error);
