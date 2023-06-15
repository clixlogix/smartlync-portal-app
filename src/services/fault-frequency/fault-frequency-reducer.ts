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
import { Filters } from 'models';
import { FaultFrequencysState } from '.';

// The initial state of the FaultFrequency page
export const initialState: FaultFrequencysState = {
    faultFrequencys: [],
    faultFrequency: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const faultFrequencysSlice = createSlice({
    name: 'faultFrequencys',
    initialState,
    reducers: {
        getAllFaultFrequencys(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllFaultFrequencys(state, action: PayloadAction<any[]>) {
            const { payload } = action;

            const faultFrequency = payload.reduce(
                (acc, row) => {
                    acc.categories.push(row?.faultCode);
                    acc.data.push(row?.occurrences);
                    return acc;
                },
                { categories: [], data: [] },
            );

            state.faultFrequencys = faultFrequency;
        },

        setFaultFrequency(state, action: PayloadAction<any>) {
            state.faultFrequency = action.payload;
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
    actions: faultFrequencyActions,
    reducer: faultFrequencyReducer,
    name: faultFrequencyKey,
} = faultFrequencysSlice;
