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
import { Filters, CarType, CarTypes } from 'models';
import { CarTypesState } from '.';
import data, { jlrData } from './sagas/data';

let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0];
const environment = window.location.href
    .replace('http://', '')
    .replace('https://', '')
    .split('.')[1]
    .toLocaleLowerCase();
tenant = tenant === 'demo' && environment === 'stage' ? 'demoStage' : tenant;
let carTypesData = jlrData;

// The initial state of the CarType page
export const initialState: CarTypesState = {
    carTypes: carTypesData,
    carType: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const carTypesSlice = createSlice({
    name: 'carTypes',
    initialState,
    reducers: {
        getAllCarTypes(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllCarTypes(state, action: PayloadAction<CarTypes>) {
            state.carTypes = action.payload;
        },

        setCarType(state, action: PayloadAction<CarType>) {
            state.carType = action.payload;
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

export const { actions: carTypeActions, reducer: carTypeReducer, name: carTypeKey } = carTypesSlice;
