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
import { Filters, ReportingViewSpr, ReportingViewSprs } from 'models';
import { ReportingViewSprsState } from '.';
import { FaultRate, FaultRates, FilterNames } from 'models';

// The initial state of the ReportingViewSpr page
export const initialState: ReportingViewSprsState = {
    reportingViewSprs: [],
    reportingViewSpr: undefined,
    reportingViewSprsFilteredByRules: [],
    filters: {},
    filterValues: { faultCodes: [] } as any,
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const reportingViewSprsSlice = createSlice({
    name: 'reportingViewSprs',
    initialState,
    reducers: {
        getAllReportingViewSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllReportingViewSprs(state, action: PayloadAction<ReportingViewSprs>) {
            const { payload = [] } = action;

            const { faultRates = [], filterValues = {} as any } = payload.reduce(
                (acc, row: FaultRate, index) => {
                    // acc.filterValues[FilterNames.studId].add(row[FilterNames.studId]);
                    acc.faultRates.push(row);

                    return acc;
                },
                {
                    faultRates: [] as FaultRates,
                    filterValues: {},
                },
            );

            // state.faultRates = faultRates;
            state.reportingViewSprs = faultRates;
            state.filterValues = filterValues;
        },

        setReportingViewSpr(state, action: PayloadAction<ReportingViewSpr>) {
            state.reportingViewSpr = action.payload;
        },

        // filterReportingViewSprsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.reportingViewSprsFilteredByRules = filterByRule(state.reportingViewSprs, action.payload);
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
    actions: reportingViewSprActions,
    reducer: reportingViewSprReducer,
    name: reportingViewSprKey,
} = reportingViewSprsSlice;
