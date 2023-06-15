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
import { Filters, TimeZoneSpr } from 'models';
import { TimeZoneSprsState } from '.';

// The initial state of the TimeZoneSpr page
export const initialState: TimeZoneSprsState = {
    timeZoneSprs: undefined,
    // timeZoneSpr: undefined,
    // timeZoneSprsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const timeZoneSprsSlice = createSlice({
    name: 'timeZoneSprs',
    initialState,
    reducers: {
        getAllTimeZoneSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllTimeZoneSprs(state, action: PayloadAction<TimeZoneSpr>) {
            state.timeZoneSprs = action.payload;
        },

        // setTimeZoneSpr(state, action: PayloadAction<TimeZoneSpr>) {
        //     state.timeZoneSpr = action.payload;
        // },

        // filterTimeZoneSprsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.timeZoneSprsFilteredByRules = filterByRule(state.timeZoneSprs, action.payload);
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

export const { actions: timeZoneSprActions, reducer: timeZoneSprReducer, name: timeZoneSprKey } = timeZoneSprsSlice;
