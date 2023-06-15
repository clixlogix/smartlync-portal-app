import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './recommended-actions-history-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.recommendedActionsHistorys || initialState;

export const selectRecommendedActionsHistorys = createSelector(
    [selectDomain],
    (state) => state.recommendedActionsHistorys || [],
);
export const selectRecommActionDefault = createSelector([selectDomain], (state) => state.getOriginalHistory || []);
export const selectRecommendedActionsHistorysFilters = createSelector([selectDomain], (state) => state.filters || {});
export const selectRecommendedActionsHistorysIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectRecommendedActionsHistorysError = createSelector([selectDomain], (state) => state.error);
