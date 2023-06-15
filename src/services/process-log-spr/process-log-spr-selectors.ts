import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './process-log-spr-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.processLogSprs || initialState;

export const selectProcessLogSprs = createSelector([selectDomain], (state) =>
    (state.processLogSprs || []).filter((row) => !row.hidden),
);
export const selectProcessLogSpr = createSelector([selectDomain], (state) => state.processLogSpr);
export const selectProcessLogSprFilters = createSelector([selectDomain], (state) => state.filters);
export const selectProcessLogSprIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectProcessLogSprError = createSelector([selectDomain], (state) => state.error);
