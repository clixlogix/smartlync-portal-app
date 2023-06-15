import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './recommended-action-submit-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.recommendedActionSubmits || initialState;

export const selectRecommendedActionSubmits = createSelector([selectDomain], (state) => state.recommendedActionSubmits);
export const selectRecommendedActionSubmitsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectRecommendedActionSubmitsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectRecommendedActionSubmitsError = createSelector([selectDomain], (state) => state.error);
