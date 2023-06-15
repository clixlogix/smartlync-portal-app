import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './plant-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.plants || initialState;

export const selectPlants = createSelector([selectDomain], (state) => state.plants);
export const selectPlantsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectPlantsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectPlantsError = createSelector([selectDomain], (state) => state.error);
