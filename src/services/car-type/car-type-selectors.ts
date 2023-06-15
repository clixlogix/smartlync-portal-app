import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './car-type-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.carTypes || initialState;

export const selectCarTypes = createSelector([selectDomain], (state) => state.carTypes);
export const selectCarType = createSelector([selectDomain], (state) => state.carType);
export const selectCarTypeFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCarTypeIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectCarTypeError = createSelector([selectDomain], (state) => state.error);
