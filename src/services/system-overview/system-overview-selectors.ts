import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './system-overview-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.systemOverviews || initialState;

export const selectSystemOverviews = createSelector([selectDomain], (state) => state.systemOverviewsFilteredByRule);
export const pinSystemOverviews = createSelector([selectDomain], (state) => state.pinSystemOverviews);
export const selectSystemOverviewsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectOperationItemFilterValues = createSelector([selectDomain], (state) => state.filterValues);
export const selectSystemOverviewsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectSystemOverviewsError = createSelector([selectDomain], (state) => state.error);
