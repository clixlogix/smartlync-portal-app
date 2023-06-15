import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './graphic-data-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.graphicDatas || initialState;

export const selectGraphicDatas = createSelector([selectDomain], (state) => state.graphicDatas);
export const selectGraphicData = createSelector([selectDomain], (state) => state.graphicData);
export const selectGraphicDataFilters = createSelector([selectDomain], (state) => state.filters);
export const selectGraphicDataIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectGraphicDataError = createSelector([selectDomain], (state) => state.error);
