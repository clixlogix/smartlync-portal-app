import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './get-last-updated-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.getLastUpdateds || initialState;

export const selectGetLastUpdateds = createSelector([selectDomain], (state) => state.getLastUpdateds);
export const selectGetLastUpdated = createSelector([selectDomain], (state) => state.getLastUpdated);
export const selectGetLastUpdatedFilters = createSelector([selectDomain], (state) => state.filters);
export const selectGetLastUpdatedIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectGetLastUpdatedError = createSelector([selectDomain], (state) => state.error);
