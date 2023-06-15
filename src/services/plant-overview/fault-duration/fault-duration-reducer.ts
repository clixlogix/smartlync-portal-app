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
import { Filters, FaultDuration, FaultDurations } from 'models';
import { FaultDurationsState } from '.';

// The initial state of the FaultDuration page
export const initialState: FaultDurationsState = {
    faultDurations: [],
    faultDuration: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const faultDurationsSlice = createSlice({
    name: 'faultDurations',
    initialState,
    reducers: {
        getAllFaultDurations(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllFaultDurations(state, action: PayloadAction<FaultDurations>) {
            const { payload = [] } = action;
            const { faultDurations = [] } = payload.reduce(
                (acc, row: FaultDuration, index) => {
                    const { duration = '' } = row;
                    acc.faultDurations.push({ ...row, duration: (+duration).toFixed(2) });

                    return acc;
                },
                {
                    faultDurations: [] as FaultDurations,
                },
            );
            state.faultDurations = faultDurations;
        },

        setFaultDuration(state, action: PayloadAction<FaultDuration>) {
            state.faultDuration = action.payload;
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
    actions: faultDurationActions,
    reducer: faultDurationReducer,
    name: faultDurationKey,
} = faultDurationsSlice;
