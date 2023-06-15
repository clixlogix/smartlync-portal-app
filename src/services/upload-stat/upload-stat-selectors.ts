import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './upload-stat-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.uploadListItems || initialState;

export const selectUploadListItems = createSelector([selectDomain], (state) => state.uploadListItems);
export const selectUploadListItem = createSelector([selectDomain], (state) => state.uploadListItem);
export const selectUploadListItemFilters = createSelector([selectDomain], (state) => state.filters);
export const selectUploadListItemsFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectUploadListItemIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectUploadListItemError = createSelector([selectDomain], (state) => state.error);
