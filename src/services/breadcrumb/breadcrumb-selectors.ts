import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './breadcrumb-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.breadcrumbs || initialState;

export const selectBreadcrumbs = createSelector([selectDomain], (state) => state.breadcrumbs);
export const selectBreadcrumb = createSelector([selectDomain], (state) => state.breadcrumb);
export const selectBreadcrumbFilters = createSelector([selectDomain], (state) => state.filters);
export const selectBreadcrumbIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectBreadcrumbError = createSelector([selectDomain], (state) => state.error);
