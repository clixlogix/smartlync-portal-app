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
import { Filters, PlantFaultByOccurenceSpr, PlantFaultByOccurenceSprs } from 'models';
import { PlantFaultByOccurenceSprsState } from '.';

// The initial state of the PlantFaultByOccurenceSpr page
export const initialState: PlantFaultByOccurenceSprsState = {
    plantFaultByOccurenceSprs: [],
    plantFaultByOccurenceSpr: undefined,
    plantFaultByOccurenceSprsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const plantFaultByOccurenceSprsSlice = createSlice({
    name: 'plantFaultByOccurenceSprs',
    initialState,
    reducers: {
        getAllPlantFaultByOccurenceSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllPlantFaultByOccurenceSprs(state, action: PayloadAction<PlantFaultByOccurenceSprs>) {
            state.plantFaultByOccurenceSprs = action.payload;
        },

        setPlantFaultByOccurenceSpr(state, action: PayloadAction<PlantFaultByOccurenceSpr>) {
            state.plantFaultByOccurenceSpr = action.payload;
        },

        // filterPlantFaultByOccurenceSprsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.plantFaultByOccurenceSprsFilteredByRules = filterByRule(
        //         state.plantFaultByOccurenceSprs,
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
    actions: plantFaultByOccurenceSprActions,
    reducer: plantFaultByOccurenceSprReducer,
    name: plantFaultByOccurenceSprKey,
} = plantFaultByOccurenceSprsSlice;
