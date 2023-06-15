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
import { Filters, PlantCycleCountSpr } from 'models';
import { PlantCycleCountSprsState } from '.';

// The initial state of the PlantCycleCountSpr page
export const initialState: PlantCycleCountSprsState = {
    plantCycleCountSprs: { cyclesData: [], previousWeekCyclesCountData: [], previousDayCyclesData: [] },
    plantCycleCountSpr: undefined,
    plantCycleCountSprsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const plantCycleCountSprsSlice = createSlice({
    name: 'plantCycleCountSprs',
    initialState,
    reducers: {
        getAllPlantCycleCountSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllPlantCycleCountSprs(state, action: PayloadAction<any>) {
            state.plantCycleCountSprs = action.payload;
        },

        setPlantCycleCountSpr(state, action: PayloadAction<PlantCycleCountSpr>) {
            state.plantCycleCountSpr = action.payload;
        },

        // filterPlantCycleCountSprsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.plantCycleCountSprsFilteredByRules = filterByRule(state.plantCycleCountSprs, action.payload);
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
    actions: plantCycleCountSprActions,
    reducer: plantCycleCountSprReducer,
    name: plantCycleCountSprKey,
} = plantCycleCountSprsSlice;
