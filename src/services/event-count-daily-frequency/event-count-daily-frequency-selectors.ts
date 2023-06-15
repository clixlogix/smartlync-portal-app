import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-count-daily-frequency-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventCountDailyFrequencys || initialState;

export const selectEventCountDailyFrequencys = createSelector(
    [selectDomain],
    (state) => state.eventCountDailyFrequencys,
);
export const selectEventCountDailyFrequencFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventCountDailyFrequency = createSelector([selectDomain], (state) => state.eventCountDailyFrequency);
export const selectEventCountDailyFrequencyFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventCountDailyFrequencyIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventCountDailyFrequencyError = createSelector([selectDomain], (state) => state.error);
