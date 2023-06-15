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
import { Filters, PlantFaultByDurationSpr, PlantFaultByDurationSprs } from 'models';
import { PlantFaultByDurationSprsState } from '.';
// import data from './sagas/data';

// The initial state of the PlantFaultByDurationSpr page
export const initialState: PlantFaultByDurationSprsState = {
    plantFaultByDurationSprs: [],
    plantFaultByDurationSpr: undefined,
    plantFaultByDurationSprsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const plantFaultByDurationSprsSlice = createSlice({
    name: 'plantFaultByDurationSprs',
    initialState,
    reducers: {
        getAllPlantFaultByDurationSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllPlantFaultByDurationSprs(state, action: PayloadAction<PlantFaultByDurationSprs>) {
            state.plantFaultByDurationSprs = action.payload;
        },

        setPlantFaultByDurationSpr(state, action: PayloadAction<PlantFaultByDurationSpr>) {
            state.plantFaultByDurationSpr = action.payload;
        },

        // filterPlantFaultByDurationSprsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.plantFaultByDurationSprsFilteredByRules = filterByRule(
        //         state.plantFaultByDurationSprs,
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
    actions: plantFaultByDurationSprActions,
    reducer: plantFaultByDurationSprReducer,
    name: plantFaultByDurationSprKey,
} = plantFaultByDurationSprsSlice;
