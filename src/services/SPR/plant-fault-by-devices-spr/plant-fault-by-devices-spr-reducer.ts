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
import { Filters, PlantFaultByDevicesSpr, PlantFaultByDevicesSprs } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { PlantFaultByDevicesSprsState } from '.';

// The initial state of the PlantFaultByDevicesSpr page
export const initialState: PlantFaultByDevicesSprsState = {
    plantFaultByDevicesSprs: [],
    plantFaultByDevicesSpr: undefined,
    plantFaultByDevicesSprsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const plantFaultByDevicesSprsSlice = createSlice({
    name: 'plantFaultByDevicesSprs',
    initialState,
    reducers: {
        getAllPlantFaultByDevicesSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllPlantFaultByDevicesSprs(state, action: PayloadAction<PlantFaultByDevicesSprs>) {
            state.plantFaultByDevicesSprs = action.payload;
        },

        setPlantFaultByDevicesSpr(state, action: PayloadAction<PlantFaultByDevicesSpr>) {
            state.plantFaultByDevicesSpr = action.payload;
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
    actions: plantFaultByDevicesSprActions,
    reducer: plantFaultByDevicesSprReducer,
    name: plantFaultByDevicesSprKey,
} = plantFaultByDevicesSprsSlice;
