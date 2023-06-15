import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './date-time-reducer';

const selectDomain = (state: RootState) => state.dateTimeFilter || initialState;

export const selectFromTimeValue = createSelector([selectDomain], (state) => state.fromTime);
export const selectToTimeValue = createSelector([selectDomain], (state) => state.toTime);
