import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-cycle-averages-widget-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plantCycleAveragesWidgetSprs || initialState;

export const selectPlantCycleAveragesWidgetSprs = createSelector(
    [selectDomain],
    (state) => state.plantCycleAveragesWidgetSprs,
);
export const selectPlantCycleAveragesWidgetSpr = createSelector(
    [selectDomain],
    (state) => state.plantCycleAveragesWidgetSpr,
);
export const selectPlantCycleAveragesWidgetSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantCycleAveragesWidgetSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantCycleAveragesWidgetSprError = createSelector([selectDomain], (state) => state.error);
