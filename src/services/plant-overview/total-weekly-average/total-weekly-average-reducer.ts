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
import { Filters, TotalWeeklyAverage } from 'models';
import { TotalWeeklyAveragesState } from '.';
import { updateWeeklyAverageWithValues } from './sagas/data';
import data from './data';

// The initial state of the TotalWeeklyAverage page
export const initialState: TotalWeeklyAveragesState = {
    totalWeeklyAverages: [],
    totalWeeklyAverage: undefined,
    filters: {},
    filterValues: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const totalWeeklyAveragesSlice = createSlice({
    name: 'totalWeeklyAverages',
    initialState,
    reducers: {
        getAllTotalWeeklyAverages(state, action: PayloadAction<any>) {
            state.filters = action.payload.filter;
        },
        setAllTotalWeeklyAverages(state, action: PayloadAction<any>) {
            state.totalWeeklyAverages = updateWeeklyAverageWithValues(action.payload);
        },
        setTotalWeeklyAverage(state, action: PayloadAction<TotalWeeklyAverage>) {
            state.totalWeeklyAverage = action.payload;
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
    actions: totalWeeklyAveragesActions,
    reducer: totalWeeklyAveragesReducer,
    name: totalWeeklyAverageKey,
} = totalWeeklyAveragesSlice;
