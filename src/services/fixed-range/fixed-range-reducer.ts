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
// import { FixedRange } from 'models';
import { FixedRangesState } from '.';
import data from './sagas/data';

// The initial state of the FixedRange page
export const initialState: FixedRangesState = {
    fixedRanges: data,
    fixedRange: undefined,
    initialFixedRange: undefined,
    fixedRangesFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const fixedRangesSlice = createSlice({
    name: 'fixedRanges',
    initialState,
    reducers: {
        setAllFixedRanges(state, action: PayloadAction<any>) {
            const newOptions = action.payload;
            state.fixedRanges = newOptions;
        },

        setInitialFixedRange(state, action: PayloadAction<any>) {
            state.initialFixedRange = action.payload;
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

export const { actions: fixedRangeActions, reducer: fixedRangeReducer, name: fixedRangeKey } = fixedRangesSlice;
