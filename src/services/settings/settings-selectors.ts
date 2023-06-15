import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './settings-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.settings || initialState;

export const selectSettingss = createSelector([selectDomain], (state) => state.settingss);
export const selectSettings = createSelector([selectDomain], (state) => state.settings);
export const selectSettingsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectSettingsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectSettingsError = createSelector([selectDomain], (state) => state.error);
