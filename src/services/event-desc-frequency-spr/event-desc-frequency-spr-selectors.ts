import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-desc-frequency-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventDescFrequencySprs || initialState;

export const selectEventDescFrequencySprs = createSelector([selectDomain], (state) => state.eventDescFrequencySprs);
export const selectEventDescFrequencySprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventDescFrequencySprFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEventDescFrequencySprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventDescGraphFrequencySprs = createSelector(
    [selectDomain],
    (state) => state.eventDescGraphFrequencySprs,
);
