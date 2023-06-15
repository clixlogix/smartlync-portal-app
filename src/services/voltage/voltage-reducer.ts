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
import { Filters, /* Voltages,*/ FilterNames } from 'models';
import { VoltagesState } from '.';

// The initial state of the Voltage page
export const initialState: VoltagesState = {
    voltages: {},
    filters: {},
    filterValues: {},
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const voltagesSlice = createSlice({
    name: 'voltages',
    initialState,
    reducers: {
        getAllVoltages(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllVoltages(state, action: PayloadAction<any>) {
            const { payload = [] } = action;
            const {
                // voltages = [],
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
            state.voltages = { maximum, minimum, actual, occurredOn };
            state.filterValues = filterValues;
        },

        // setVoltage(state, action: PayloadAction<Voltage>) {
        //     state.voltage = action.payload;
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

export const { actions: voltageActions, reducer: voltageReducer, name: voltageKey } = voltagesSlice;
