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
import { FaultRate, FaultRates, FilterNames, Filters } from 'models';
import { FaultRatesState } from '.';

// The initial state of the FaultRate page
export const initialState: FaultRatesState = {
    faultRates: [],

    filters: {},
    filterValues: { faultCodes: [] } as any,

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const faultRatesSlice = createSlice({
    name: 'faultRates',
    initialState,
    reducers: {
        faultRates(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setFaultRates(state, action: PayloadAction<FaultRates>) {
            const { payload = [] } = action;

            const { faultRates = [], filterValues = {} as any } = payload.reduce(
                (acc, row: FaultRate, index) => {
                    acc.filterValues[FilterNames.studId].add(row[FilterNames.studId]);
                    acc.faultRates.push(row);

                    return acc;
                },
                {
                    faultRates: [] as FaultRates,
                    filterValues: {
                        [FilterNames.studId]: new Set(),
                    },
                },
            );

            state.faultRates = faultRates;
            state.filterValues = filterValues;
        },
        update(state) {
            state.faultRates = [...state.faultRates];
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

export const { actions: faultRatesActions, reducer: faultRatesReducer, name: faultRatesKey } = faultRatesSlice;
