import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './historical-diagnostic-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.historicalDiagnostics || initialState;

export const selectHistoricalDiagnostics = createSelector([selectDomain], (state) => state.historicalDiagnostics);
export const selectHistoricalDiagnostic = createSelector([selectDomain], (state) => state.historicalDiagnostic);
export const selectHistoricalDiagnosticFilters = createSelector([selectDomain], (state) => state.filters);
export const selectHistoricalDiagnosticIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectHistoricalDiagnosticError = createSelector([selectDomain], (state) => state.error);
export const selectHistoricalSprs = createSelector([selectDomain], (state) => state.historicalSpr);
