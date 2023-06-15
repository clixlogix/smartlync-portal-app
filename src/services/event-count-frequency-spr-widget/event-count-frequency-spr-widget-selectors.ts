import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './event-count-frequency-spr-widget-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventCountFrequencySprWidgets || initialState;

export const selectEventCountFrequencySprWidgets = createSelector(
    [selectDomain],
    (state) => state.eventCountFrequencySprWidgets,
);
export const selectEventCountFrequencySprWidget = createSelector(
    [selectDomain],
    (state) => state.eventCountFrequencySprWidget,
);
export const selectEventCountFrequencyWidgetSprFilterValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);
export const selectEventCountFrequencySprWidgetFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventCountFrequencySprWidgetIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventCountFrequencySprWidgetError = createSelector([selectDomain], (state) => state.error);
