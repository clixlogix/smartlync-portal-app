import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './event-count-frequency-widget-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.eventCountFrequencyWidgets || initialState;

export const selectEventCountFrequencyWidgets = createSelector(
    [selectDomain],
    (state) => state.eventCountFrequencyWidgets,
);
export const selectEventCountFrequencyWidget = createSelector(
    [selectDomain],
    (state) => state.eventCountFrequencyWidget,
);
export const selectEventCountFrequencyWidgetFilterValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);
export const selectEventCountFrequencyWidgetFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEventCountFrequencyWidgetIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEventCountFrequencyWidgetError = createSelector([selectDomain], (state) => state.error);
