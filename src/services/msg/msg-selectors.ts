import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './msg-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.msg || initialState;

export const selectMsg = createSelector([selectDomain], (msgState) => msgState);

export default selectMsg;
