import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './cycle-gap-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.cycleGapSprs || initialState;

export const selectCycleGapSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCycleGapSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFormattedCycleSprGaps = createSelector([selectDomain], (state) => state.formattedCycleGaps);
export const selectCycleGapsSprTempoFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectFormattedCycleGapSprEvents = createSelector(
    [selectDomain],
    (state) => state.formattedCycleGapEvents,
);
