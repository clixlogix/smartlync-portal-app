import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './historical-diagnostic-graph-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.historicalDiagnosticGraphs || initialState;

export const selectHistoricalDiagnosticGraphs = createSelector(
    [selectDomain],
    (state) => state.historicalDiagnosticGraphs,
);
export const selectHistoricalDiagnosticGraph = createSelector(
    [selectDomain],
    (state) => state.historicalDiagnosticGraph,
);
export const selectHistoricalDiagnosticGraphFilters = createSelector([selectDomain], (state) => state.filters);
export const selectHistoricalDiagnosticGraphIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectHistoricalDiagnosticGraphError = createSelector([selectDomain], (state) => state.error);
export const selectHistoricalGraphsSpr = createSelector([selectDomain], (state) => state.historicalSprGraphs);
export const selectHistoricalGraphsPins = createSelector([selectDomain], (state) => state.pins);
