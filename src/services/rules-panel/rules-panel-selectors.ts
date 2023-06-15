import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './rules-panel-reducer';

const selectDomain = (state: RootState) => state.rulesPanel || initialState;

export const selectIsPanelOpen = createSelector([selectDomain], (state) => state.isPanelOpen);
export const selectRules = createSelector([selectDomain], (state) => state.rules);
export const selectSavedRules = createSelector([selectDomain], (state) => state.savedRules);
export const selectAppliedRules = createSelector([selectDomain], (state) => state.appliedRules);
