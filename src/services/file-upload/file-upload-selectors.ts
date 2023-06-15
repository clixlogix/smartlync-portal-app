import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './file-upload-reducer';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.fileUploads || initialState;

export const selectFileUploads = createSelector([selectDomain], (state) => (key: string) =>
    state.files[key] ? Array.from(state.files[key]?.values()) : [],
);

export const selectUploadProgress = createSelector([selectDomain], (state) => (key: string) =>
    state.uploadProgress[key] ? state.uploadProgress[key] : {},
);

export const selectFileUploadsFilters = createSelector([selectDomain], (state) => state.filters);
export const selectFileUploadsIsLoading = createSelector([selectDomain], (state) => state.isLoading);
export const selectFileUploadsError = createSelector([selectDomain], (state) => state.error);
