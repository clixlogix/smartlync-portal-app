import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './car-body-duration-widget-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.carBodyDurationWidgets || initialState;

export const selectCarBodyDurationWidgets = createSelector([selectDomain], (state) => state.carBodyDurationWidgets);
export const selectCarBodyDurationWidget = createSelector([selectDomain], (state) => state.carBodyDurationWidget);
export const selectCarBodyDurationWidgetFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCarBodyDurationWidgetIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectCarBodyDurationWidgetError = createSelector([selectDomain], (state) => state.error);
export const selectCarBodyCategories = createSelector([selectDomain], (state) => state.categories);
export const selectDurationGraphData = createSelector([selectDomain], (state) => state.graphData);
export const selectDurationSecondaryGraphData = createSelector([selectDomain], (state) => state.secondaryGraphData);
