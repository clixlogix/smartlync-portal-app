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
import { Filters, TopFaultCount, TopFaultCounts } from 'models';
import { TopFaultCountsState } from '.';
import * as _ from 'lodash';

// The initial state of the TopFaultCount page
export const initialState: TopFaultCountsState = {
    topFaultCounts: [],
    topFaultCount: undefined,
    filters: {},
    topFaultCountsColumns: [],

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const topFaultCountsSlice = createSlice({
    name: 'topFaultCounts',
    initialState,
    reducers: {
        getAllTopFaultCounts(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllTopFaultCounts(state, action: PayloadAction<TopFaultCounts>) {
            const { payload } = action;
            const grouping = 'deviceName';
            let totalFaultCounts = { total: 0 };
            const uniqueFaultCodes = _.uniqBy(payload, 'faultCode');

            const columns = uniqueFaultCodes.reduce((acc, item: any) => {
                acc.push({ faultCode: item.faultCode, description: item?.details?.description });
                return acc;
            }, []);
            state.topFaultCountsColumns = columns;

            const defaultTableValues = 0;
            const intervals: any = columns.reduce((acc = {}, dte) => {
                acc[dte?.faultCode] = defaultTableValues;
                totalFaultCounts[dte?.faultCode] = 0;
                return acc;
            }, {});

            const topFaultCounts = Array.from(
                payload
                    .reduce((acc: Map<string, any>, row: any, index: number) => {
                        const key = grouping
                            .split(',')
                            .map((g) => row[g])
                            .join(',');
                        const { deviceName, faultCode, occurrences } = row;
                        const dte = faultCode;

                        let tableRow = {
                            id: `${100000 + index}` || `${Math.random()}`,
                            deviceName,
                            ...intervals,
                            [dte]: +occurrences,
                            total: defaultTableValues,
                        };

                        if (acc.has(key)) {
                            tableRow = acc.get(key);
                            tableRow[dte] = +occurrences;
                        }
                        tableRow.total += +occurrences;

                        acc.set(key, tableRow);
                        return acc;
                    }, new Map<string, any>())
                    .values(),
            );

            state.topFaultCounts = topFaultCounts;
        },

        setTopFaultCount(state, action: PayloadAction<TopFaultCount>) {
            state.topFaultCount = action.payload;
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
    actions: topFaultCountActions,
    reducer: topFaultCountReducer,
    name: topFaultCountKey,
} = topFaultCountsSlice;
