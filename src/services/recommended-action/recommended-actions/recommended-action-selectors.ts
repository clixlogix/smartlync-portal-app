import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './recommended-action-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.recommendedActions || initialState;

export const selectRecommendedActions = createSelector([selectDomain], (state) => state.recommendedActions);
export const selectRecommendedActionsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectRecommendedActionsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectRecommendedActionsError = createSelector([selectDomain], (state) => state.error);
export const selectGetRecommendedAction = createSelector([selectDomain], (state) => (actionId) =>
    state.recommendedActions.recommendedAction.find((action) => `${action.actionId}` === actionId),
);
