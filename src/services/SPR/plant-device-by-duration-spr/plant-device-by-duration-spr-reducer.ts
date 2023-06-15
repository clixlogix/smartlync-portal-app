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
import { Filters, PlantDeviceByDurationSpr, PlantDeviceByDurationSprs } from 'models';
import { PlantDeviceByDurationSprsState } from '.';
import data from './sagas/data';

// The initial state of the PlantDeviceByDurationSpr page
export const initialState: PlantDeviceByDurationSprsState = {
    plantDeviceByDurationSprs: data,
    plantDeviceByDurationSpr: undefined,
    plantDeviceByDurationSprsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const plantDeviceByDurationSprsSlice = createSlice({
    name: 'plantDeviceByDurationSprs',
    initialState,
    reducers: {
        getAllPlantDeviceByDurationSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllPlantDeviceByDurationSprs(state, action: PayloadAction<PlantDeviceByDurationSprs>) {
            const { payload = [] } = action;
            const { faultDurations = [] } = payload.reduce(
                (acc: any, row: PlantDeviceByDurationSpr, index) => {
                    const { duration = '' } = row;
                    acc.faultDurations.push({ ...row, duration: (+duration).toFixed(2) });

                    return acc;
                },
                {
                    faultDurations: [] as PlantDeviceByDurationSpr,
                },
            );
            state.plantDeviceByDurationSprs = faultDurations;
        },

        setPlantDeviceByDurationSpr(state, action: PayloadAction<PlantDeviceByDurationSpr>) {
            state.plantDeviceByDurationSpr = action.payload;
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
    actions: plantDeviceByDurationSprActions,
    reducer: plantDeviceByDurationSprReducer,
    name: plantDeviceByDurationSprKey,
} = plantDeviceByDurationSprsSlice;
