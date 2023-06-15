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
import { /* Stations, */ Filters } from 'models';
import { StationsState } from '.';

// The initial state of the Stations page
export const initialState: StationsState = {
    stations: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const stationsSlice = createSlice({
    name: 'stations',
    initialState,
    reducers: {
        stations(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setStations(state, action: PayloadAction<any /* Stations */>) {
            state.stations = action.payload;
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

export const { actions: stationsActions, reducer: stationsReducer, name: stationsKey } = stationsSlice;
