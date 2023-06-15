import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './penetration-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.penetrations || initialState;

export const selectPenetrations = createSelector([selectDomain], (state) => state.penetrations);
export const selectPenetrationFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPenetrationFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectPenetrationIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPenetrationError = createSelector([selectDomain], (state) => state.error);
