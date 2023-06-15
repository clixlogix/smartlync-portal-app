import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './dashboard-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.dashboards || initialState;

export const selectDashboards = createSelector([selectDomain], (state) => state.dashboards);
export const selectDashboardsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectDashboardsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectDashboardsError = createSelector([selectDomain], (state) => state.error);
