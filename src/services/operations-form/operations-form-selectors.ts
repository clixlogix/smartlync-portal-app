import { createSelector } from '@reduxjs/toolkit';

import { initialState } from './operations-form-reducer';

// First select the relevant part from the state
const openForm = (state) => state.operationsForm || initialState;

export const selectOpenForm = createSelector([openForm], (openFormState) => openFormState.isOpen);

export default selectOpenForm;
