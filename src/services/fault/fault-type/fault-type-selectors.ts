import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './fault-type-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.faultTypes || initialState;

export const selectFaultTypes = createSelector([selectDomain], (state) => state.faultTypes);
export const selectFaultTypesFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFaultTypesIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFaultTypesError = createSelector([selectDomain], (state) => state.error);
