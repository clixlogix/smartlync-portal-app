import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './measurement-aggregate-widget-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.measurementAggregateWidgetSprs || initialState;

export const selectMeasurementAggregateWidgetSprs = createSelector(
    [selectDomain],
    (state) => state.measurementAggregateWidgetSprs,
);
export const selectMeasurementAggregateWidgetSpr = createSelector(
    [selectDomain],
    (state) => state.measurementAggregateWidgetSpr,
);
export const selectMeasurementAggregateWidgetSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMeasurementAggregateWidgetSprFiltersValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);

export const selectMeasurementAggregateWidgetSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMeasurementAggregateWidgetSprError = createSelector([selectDomain], (state) => state.error);
export const selectFormattedCycleGapEvents = createSelector([selectDomain], (state) => state.formattedCycleGapEvents);
