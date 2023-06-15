import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './essential-control-widgets-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.essentialControlWidgetss || initialState;

export const selectEssentialControlWidgetss = createSelector([selectDomain], (state) => state.essentialControlWidgetss);
export const selectEssentialControlWidgets = createSelector([selectDomain], (state) => state.essentialControlWidgets);
export const selectEssentialControlWidgetsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectEssentialControlWidgetsFiltersValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectEssentialControlWidgetsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectEssentialControlWidgetsError = createSelector([selectDomain], (state) => state.error);
