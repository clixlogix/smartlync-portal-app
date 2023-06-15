/*
 * Msg Slice
 *
 * Here we define:
 * - The shape of our auth container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, UploadListItem, UploadListItems } from 'models';
import { UploadStatsState } from '.';
import data from './sagas/data';

// The initial state of the UploadStat page
export const initialState: UploadStatsState = {
    uploadListItems: data,
    uploadListItem: undefined,
    filters: {},
    filterValues: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const uploadStatsSlice = createSlice({
    name: 'uploadListItems',
    initialState,
    reducers: {
        getAllUploadListItems(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllUploadListItems(state, action: PayloadAction<UploadListItems>) {
            state.uploadListItems = action.payload;
        },

        setUploadListModel(state, action: PayloadAction<UploadListItem>) {
            state.uploadListItem = action.payload;
        },

        error(state, action: PayloadAction<CustomError>) {
            state.error = action.payload;
        },
        loading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        clear(state) {
            state = { ...initialState };
        },
    },
});

export const { actions: uploadStatActions, reducer: uploadStatReducer, name: uploadStatKey } = uploadStatsSlice;
