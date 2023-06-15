import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './measurements-spr-widget-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.measurementsSprWidgets || initialState;

export const selectMeasurementsSprWidgets = createSelector([selectDomain], (state) => state.measurementsSprWidgets);
export const selectMeasurementsSprWidgetsFilteredByRules = createSelector(
    [selectDomain],
    (state) => state.measurementsSprWidgetsFilteredByRules,
);
export const selectMeasurementsSprWidgetFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMeasurementsSprWidgetIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMeasurementsSprWidgetFilterValues = createSelector([selectDomain], (state) => state.filterValues);
