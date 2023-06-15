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
import { Filters, FilterNames } from 'models';
import { PenetrationSprsState } from '.';

// The initial state of the PenetrationSpr page
export const initialState: PenetrationSprsState = {
    penetrationSprs: {},
    filters: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const penetrationSprsSlice = createSlice({
    name: 'penetrationSprs',
    initialState,
    reducers: {
        getAllPenetrationSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllPenetrationSprs(state, action: PayloadAction<any>) {
            // state.penetrationSprs = action.payload;
            const { payload = [] } = action;
            const {
                // penetrations = [],
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
            state.penetrationSprs = { maximum, minimum, actual, occurredOn };
            state.filterValues = filterValues;
        },
        // filterPenetrationSprsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.penetrationSprsFilteredByRules = filterByRule(state.penetrationSprs, action.payload);
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
    actions: penetrationSprActions,
    reducer: penetrationSprReducer,
    name: penetrationSprKey,
} = penetrationSprsSlice;
