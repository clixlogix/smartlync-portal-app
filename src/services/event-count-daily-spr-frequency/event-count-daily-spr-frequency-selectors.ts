import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-count-daily-spr-frequency-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventCountDailyFrequencySprs || initialState;

export const selectEventCountDailyFrequencySprs = createSelector(
    [selectDomain],
    (state) => state.eventCountDailyFrequencySprs,
);
export const selectEventCountDailyFrequencySprFilterValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);
export const selectEventCountDailyFrequencySpr = createSelector(
    [selectDomain],
    (state) => state.eventCountDailyFrequencySpr,
);
export const selectEventCountDailyFrequencySprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventCountDailyFrequencySprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventCountDailyFrequencySprError = createSelector([selectDomain], (state) => state.error);
