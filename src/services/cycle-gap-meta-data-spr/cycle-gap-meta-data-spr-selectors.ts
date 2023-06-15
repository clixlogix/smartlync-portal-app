import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './cycle-gap-meta-data-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.cycleGapMetaDataSprs || initialState;

export const selectCycleGapMetaDataSprs = createSelector([selectDomain], (state) => state.cycleGapMetaDataSprs);
export const selectCycleGapMetaDataSpr = createSelector([selectDomain], (state) => state.cycleGapMetaDataSpr);
export const selectCycleGapMetaDataSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCycleGapMetaDataSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectCycleGapMetaDataSprError = createSelector([selectDomain], (state) => state.error);
