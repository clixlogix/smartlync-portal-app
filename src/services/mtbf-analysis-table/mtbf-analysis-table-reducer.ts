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
import { Filters, MtbfAnalysisTable, MtbfAnalysisTables } from 'models';
import { MtbfAnalysisTablesState } from '.';
import filter from 'lodash/filter';

// The initial state of the MtbfAnalysisTable page
export const initialState: MtbfAnalysisTablesState = {
    mtbfAnalysisTables: [],
    mtbfAnalysisTable: undefined,
    defaultValue: [],
    filters: {},
    columns: undefined,
    mtbfData: undefined,
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const mtbfAnalysisTablesSlice = createSlice({
    name: 'mtbfAnalysisTables',
    initialState,
    reducers: {
        getAllMtbfAnalysisTables(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllMtbfAnalysisTables(state, action: PayloadAction<MtbfAnalysisTables>) {
            const { payload } = action;
            state.defaultValue = payload;
            const { filters } = state;
            const grouping = filters.groupBy;

            const data: MtbfAnalysisTables =
                grouping === 'outlet' && filters.systemFaults === 'Exclude'
                    ? filter(payload, function (o) {
                          return o.outlet.split('-')[1] !== 'System';
                      })
                    : payload;
            const extCol: Set<string> = new Set<string>();
            const strCol: Set<string> = new Set<string>();

            payload.forEach((row: any) => {
                const { faultCode } = row;

                if (!isNaN(faultCode)) {
                    extCol.add(faultCode);
                    return;
                }

                strCol.add(faultCode);
            });

            const extraColumns: Array<string> = [...Array.from(strCol), ...Array.from(extCol)];
            const defaultTableValues = '';

            const intervals: any = extraColumns.reduce((acc = {}, dte) => {
                acc[dte] = defaultTableValues;
                return acc;
            }, {});

            const mtbfData = Array.from(
                data
                    .reduce((acc: Map<string, any>, row: any, index: number) => {
                        const key = grouping
                            .split(',')
                            .map((g) => row[g])
                            .join(',');
                        const { faultCode, mtbf } = row;
                        const dte = faultCode;

                        let tableRow = {
                            id: `${100000 + index}` || `${Math.random()}`,
                            ...intervals,
                            [dte]: +mtbf,
                            ...row,
                        };

                        if (acc.has(key)) {
                            tableRow = acc.get(key);
                            tableRow[dte] = +mtbf;
                        }

                        acc.set(key, tableRow);
                        return acc;
                    }, new Map<string, any>())
                    .values(),
            );

            state.columns = extraColumns;
            state.mtbfAnalysisTables = mtbfData;
        },

        setMtbfAnalysisTable(state, action: PayloadAction<MtbfAnalysisTable>) {
            state.mtbfAnalysisTable = action.payload;
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
    actions: mtbfAnalysisTableActions,
    reducer: mtbfAnalysisTableReducer,
    name: mtbfAnalysisTableKey,
} = mtbfAnalysisTablesSlice;
