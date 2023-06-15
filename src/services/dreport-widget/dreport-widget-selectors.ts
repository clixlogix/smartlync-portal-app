import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './dreport-widget-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.dReportWidgets || initialState;

export const selectDReportWidgets = createSelector([selectDomain], (state) => state.dReportWidgets);
export const selectDReportWidget = createSelector([selectDomain], (state) => state.dReportWidget);
export const selectDReportWidgetFilters = createSelector([selectDomain], (state) => state.filters);
export const selectDReportWidgetIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectDReportWidgetError = createSelector([selectDomain], (state) => state.error);
