import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './lift-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.liftSprs || initialState;

export const selectLiftSprs = createSelector([selectDomain], (state) => state.liftSprs);
export const selectLiftSpr = createSelector([selectDomain], (state) => state.liftSpr);
export const selectLiftSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectLiftSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectLiftSprError = createSelector([selectDomain], (state) => state.error);
