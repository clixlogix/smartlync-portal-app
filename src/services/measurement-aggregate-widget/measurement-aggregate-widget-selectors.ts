import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './measurement-aggregate-widget-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.measurementAggregateWidgets || initialState;

export const selectMeasurementAggregateWidgets = createSelector(
    [selectDomain],
    (state) => state.measurementAggregateWidgets,
);
export const selectMeasurementAggregateWidget = createSelector(
    [selectDomain],
    (state) => state.measurementAggregateWidget,
);
export const selectMeasurementAggregateWidgetFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMeasurementAggregateWidgetFiltersValues = createSelector(
    [selectDomain],
    (state) => state.filterValues,
);
export const selectMeasurementAggregateWidgetIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMeasurementAggregateWidgetError = createSelector([selectDomain], (state) => state.error);
export const selectFormattedCycleGapEvents = createSelector([selectDomain], (state) => state.formattedCycleGapEvents);
