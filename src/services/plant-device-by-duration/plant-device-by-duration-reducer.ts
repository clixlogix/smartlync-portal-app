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
import { Filters, PlantDeviceByDuration, PlantDeviceByDurations } from 'models';
import { PlantDeviceByDurationsState } from '.';
import data from './sagas/data';

// The initial state of the PlantDeviceByDuration page
export const initialState: PlantDeviceByDurationsState = {
    plantDeviceByDurations: data,
    plantDeviceByDuration: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const plantDeviceByDurationsSlice = createSlice({
    name: 'plantDeviceByDurations',
    initialState,
    reducers: {
        getAllPlantDeviceByDurations(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllPlantDeviceByDurations(state, action: PayloadAction<PlantDeviceByDurations>) {
            const { payload = [] } = action;
            const { faultDurations = [] } = payload.reduce(
                (acc, row: PlantDeviceByDuration, index) => {
                    const { duration = '' } = row;
                    acc.faultDurations.push({ ...row, duration: (+duration).toFixed(2) });

                    return acc;
                },
                {
                    faultDurations: [] as PlantDeviceByDurations,
                },
            );
            state.plantDeviceByDurations = faultDurations;
        },

        setPlantDeviceByDuration(state, action: PayloadAction<PlantDeviceByDuration>) {
            state.plantDeviceByDuration = action.payload;
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
    actions: plantDeviceByDurationActions,
    reducer: plantDeviceByDurationReducer,
    name: plantDeviceByDurationKey,
} = plantDeviceByDurationsSlice;
