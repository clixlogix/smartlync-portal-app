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
import { Filters, FleetExpandDeviceTable, FleetExpandDeviceTables } from 'models';
import { FleetExpandDeviceTablesState } from '.';
import data from './sagas/data';

// The initial state of the FleetExpandDeviceTable page
export const initialState: FleetExpandDeviceTablesState = {
    fleetExpandDeviceTables: data,
    fleetExpandDeviceTable: undefined,
    fleetExpandDeviceTablesFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const fleetExpandDeviceTablesSlice = createSlice({
    name: 'fleetExpandDeviceTables',
    initialState,
    reducers: {
        getAllFleetExpandDeviceTables(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllFleetExpandDeviceTables(state, action: PayloadAction<FleetExpandDeviceTables>) {
            state.fleetExpandDeviceTables = action.payload;
        },

        setFleetExpandDeviceTable(state, action: PayloadAction<FleetExpandDeviceTable>) {
            state.fleetExpandDeviceTable = action.payload;
        },

        // filterFleetExpandDeviceTablesByRules(state, action: PayloadAction<Rule[]>) {
        //     state.fleetExpandDeviceTablesFilteredByRules = filterByRule(state.fleetExpandDeviceTables, action.payload);
        // },

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
    actions: fleetExpandDeviceTableActions,
    reducer: fleetExpandDeviceTableReducer,
    name: fleetExpandDeviceTableKey,
} = fleetExpandDeviceTablesSlice;
