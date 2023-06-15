import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './cycle-gap-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.cycleGaps || initialState;

export const selectCycleGapFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCycleGapIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFormattedCycleGaps = createSelector([selectDomain], (state) => state.formattedCycleGaps);
export const selectCycleGapsTempoFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectFormattedCycleGapEvents = createSelector([selectDomain], (state) => state.formattedCycleGapEvents);
