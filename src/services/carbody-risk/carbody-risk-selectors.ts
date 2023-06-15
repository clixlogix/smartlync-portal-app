import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './carbody-risk-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.carbodyRisks || initialState;

export const selectCarbodyRisks = createSelector([selectDomain], (state) => state.carbodyRisks);
export const selectCarbodyRisk = createSelector([selectDomain], (state) => state.carbodyRisk);
export const selectCarbodyRiskFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCarbodyRiskIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectCarbodyRiskError = createSelector([selectDomain], (state) => state.error);
export const selectCarbodyTableColumns = createSelector([selectDomain], (state) => state.columns);
