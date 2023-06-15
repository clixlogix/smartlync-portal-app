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
import { Filters, /* Lifts,*/ FilterNames } from 'models';
import { LiftsState } from '.';

// The initial state of the Lift page
export const initialState: LiftsState = {
    lifts: {},
    filters: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const liftsSlice = createSlice({
    name: 'lifts',
    initialState,
    reducers: {
        getAllLifts(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllLifts(state, action: PayloadAction<any>) {
            const { payload = [] } = action;
            const {
                // lifts = [],
                filterValues = {} as any,
                // deviceNames = [],
                studIds = [],
                weeks = [],
                // studTypes = [],
                maximum = [],
                minimum = [],
                actual = [],
                occurredOn = [],
            } = payload || {};
            // filterValues[FilterNames.deviceName] = deviceNames;
            if (studIds.length !== 1) {
                filterValues[FilterNames.studId] = studIds;
            }
            filterValues[FilterNames.week] = weeks;
            // filterValues[FilterNames.studType] = studTypes;
            state.lifts = { maximum, minimum, actual, occurredOn };
            state.filterValues = filterValues;
        },

        // setLift(state, action: PayloadAction<Lift>) {
        //     state.lift = action.payload;
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

export const { actions: liftActions, reducer: liftReducer, name: liftKey } = liftsSlice;
