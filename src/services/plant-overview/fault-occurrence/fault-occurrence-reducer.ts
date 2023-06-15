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
import { Filters, FaultOccurrence, FaultOccurrences } from 'models';
import { FaultOccurrencesState } from '.';
// import data from './data';

// The initial state of the FaultOccurrence page
export const initialState: FaultOccurrencesState = {
    faultOccurrences: [],
    faultOccurrence: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const faultOccurrencesSlice = createSlice({
    name: 'faultOccurrences',
    initialState,
    reducers: {
        getAllFaultOccurrences(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllFaultOccurrences(state, action: PayloadAction<FaultOccurrences>) {
            state.faultOccurrences = action.payload;
        },

        setFaultOccurrence(state, action: PayloadAction<FaultOccurrence>) {
            state.faultOccurrence = action.payload;
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

export const {
    actions: faultOccurrencesActions,
    reducer: faultOccurrencesReducer,
    name: faultOccurrencesKey,
} = faultOccurrencesSlice;
