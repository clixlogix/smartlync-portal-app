import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './voltage-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.voltages || initialState;

export const selectVoltages = createSelector([selectDomain], (state) => state.voltages);
export const selectVoltageFilters = createSelector([selectDomain], (state) => state.filters);
export const selectVoltageFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectVoltageIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectVoltageError = createSelector([selectDomain], (state) => state.error);
