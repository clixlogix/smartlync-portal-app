import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './program-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.programs || initialState;

export const selectPrograms = createSelector([selectDomain], (state) => state.programs);
export const selectProgramDetail = createSelector([selectDomain], (state) => state.programDetail);
export const selectProgramParameter = createSelector([selectDomain], (state) => state.programParameter);
export const selectEditedProgramParameters = createSelector([selectDomain], (state) => state.editedProgramParameters);
export const selectProgram = createSelector([selectDomain], (state) => state.program);
export const selectProgramFilters = createSelector([selectDomain], (state) => state.filters);
export const selectProgramIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectProgramError = createSelector([selectDomain], (state) => state.error);
