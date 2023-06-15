import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './uptime-distribution-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.uptimeDistributions || initialState;

export const selectUptimeDistributions = createSelector([selectDomain], (state) => state.uptimeDistributions);
export const selectUptimeDistribution = createSelector([selectDomain], (state) => state.uptimeDistribution);
export const selectUptimeDistributionFilters = createSelector([selectDomain], (state) => state.filters);
export const selectUptimeDistributionIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectUptimeDistributionError = createSelector([selectDomain], (state) => state.error);
