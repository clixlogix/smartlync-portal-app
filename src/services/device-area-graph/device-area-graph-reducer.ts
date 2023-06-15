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
import { Filters, DeviceAreaGraph, DeviceAreaGraphs } from 'models';
import { DeviceAreaGraphsState } from '.';
import data from './sagas/data';

// The initial state of the DeviceAreaGraph page
export const initialState: DeviceAreaGraphsState = {
    deviceAreaGraphs: data,
    deviceAreaGraph: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const deviceAreaGraphsSlice = createSlice({
    name: 'deviceAreaGraphs',
    initialState,
    reducers: {
        getAllDeviceAreaGraphs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllDeviceAreaGraphs(state, action: PayloadAction<DeviceAreaGraphs>) {
            state.deviceAreaGraphs = action.payload;
        },

        setDeviceAreaGraph(state, action: PayloadAction<DeviceAreaGraph>) {
            state.deviceAreaGraph = action.payload;
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
    actions: deviceAreaGraphActions,
    reducer: deviceAreaGraphReducer,
    name: deviceAreaGraphKey,
} = deviceAreaGraphsSlice;
