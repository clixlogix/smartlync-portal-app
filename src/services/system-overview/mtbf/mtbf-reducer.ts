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
import { Filters, Mtbf, Mtbfs } from 'models';
import { MtbfsState } from '.';

// The initial state of the Mtbf page
export const initialState: MtbfsState = {
    mtbfs: [],
    // mtbfs: data,
    mtbf: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const mtbfsSlice = createSlice({
    name: 'mtbfs',
    initialState,
    reducers: {
        getAllMtbfs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllMtbfs(state, action: PayloadAction<Mtbfs>) {
            state.mtbfs = action.payload;
        },

        setMtbf(state, action: PayloadAction<Mtbf>) {
            state.mtbf = action.payload;
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

export const { actions: mtbfsActions, reducer: mtbfsReducer, name: mtbfsKey } = mtbfsSlice;
