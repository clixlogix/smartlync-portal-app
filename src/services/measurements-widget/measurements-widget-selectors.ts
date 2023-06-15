import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './measurements-widget-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.measurementsWidgets || initialState;

export const selectMeasurementsWidgets = createSelector([selectDomain], (state) => state.measurementsWidgets);
export const selectMeasurementsWidget = createSelector([selectDomain], (state) => state.measurementsWidget);
export const selectMeasurementsWidgetFilters = createSelector([selectDomain], (state) => state.filters);
export const selectMeasurementsWidgetIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectMeasurementsWidgetError = createSelector([selectDomain], (state) => state.error);
export const selectMeasurementsWidgetFilterValues = createSelector([selectDomain], (state) => state.filterValues);
