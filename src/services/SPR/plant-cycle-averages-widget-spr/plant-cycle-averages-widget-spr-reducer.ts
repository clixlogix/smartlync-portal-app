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
import { Filters, PlantCycleAveragesWidgetSpr } from 'models';
import { PlantCycleAveragesWidgetSprsState } from '.';
import { updateWeeklyAverageWithValues } from './sagas/data';

// import { updateWeeklyAverageWithValues } from './sagas/data';
import data from './data';
// The initial state of the PlantCycleAveragesWidgetSpr page
export const initialState: PlantCycleAveragesWidgetSprsState = {
    plantCycleAveragesWidgetSprs: [],
    plantCycleAveragesWidgetSpr: undefined,
    plantCycleAveragesWidgetSprsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const plantCycleAveragesWidgetSprsSlice = createSlice({
    name: 'plantCycleAveragesWidgetSprs',
    initialState,
    reducers: {
        getAllPlantCycleAveragesWidgetSprs(state, action: PayloadAction<any>) {
            state.filters = action.payload.filter;
        },
        setAllPlantCycleAveragesWidgetSprs(state, action: PayloadAction<any>) {
            state.plantCycleAveragesWidgetSprs = updateWeeklyAverageWithValues(action.payload);
        },

        setPlantCycleAveragesWidgetSpr(state, action: PayloadAction<PlantCycleAveragesWidgetSpr>) {
            state.plantCycleAveragesWidgetSpr = action.payload;
        },

        // filterPlantCycleAveragesWidgetSprsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.plantCycleAveragesWidgetSprsFilteredByRules = filterByRule(
        //         state.plantCycleAveragesWidgetSprs,
        //         action.payload,
        //     );
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
    actions: plantCycleAveragesWidgetSprActions,
    reducer: plantCycleAveragesWidgetSprReducer,
    name: plantCycleAveragesWidgetSprKey,
} = plantCycleAveragesWidgetSprsSlice;
