import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './cycle-gap-meta-data-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.cycleGapMetaDatas || initialState;

export const selectCycleGapMetaDatas = createSelector([selectDomain], (state) => state.cycleGapMetaDatas);
export const selectCycleGapMetaData = createSelector([selectDomain], (state) => state.cycleGapMetaData);
export const selectCycleGapMetaDataFilters = createSelector([selectDomain], (state) => state.filters);
export const selectCycleGapMetaDataIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectCycleGapMetaDataError = createSelector([selectDomain], (state) => state.error);
export const selectCycleGapMetaDataPins = createSelector([selectDomain], (state) => state.pins);
