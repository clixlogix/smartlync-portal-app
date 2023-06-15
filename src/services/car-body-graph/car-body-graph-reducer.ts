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
import { Filters, CarBodyGraph, CarBodyGraphs } from 'models';
import { CarBodyGraphsState } from '.';

// The initial state of the CarBodyGraph page
export const initialState: CarBodyGraphsState = {
    carBodyGraphs: [],
    carBodyGraph: undefined,
    filters: {},
    filterValues: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const carBodyGraphsSlice = createSlice({
    name: 'carBodyGraphs',
    initialState,
    reducers: {
        getAllCarBodyGraphs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllCarBodyGraphs(state, action: PayloadAction<CarBodyGraphs>) {
            const { payload = [] } = action;

            state.carBodyGraphs = payload;
        },

        setCarBodyGraph(state, action: PayloadAction<CarBodyGraph>) {
            state.carBodyGraph = action.payload;
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

export const { actions: carBodyGraphActions, reducer: carBodyGraphReducer, name: carBodyGraphKey } = carBodyGraphsSlice;
