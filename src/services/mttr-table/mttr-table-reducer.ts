import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { Filters, MttrTable, MttrTables } from 'models';
import { MttrTablesState } from '.';
import filter from 'lodash/filter';

// The initial state of the MttrTable page
export const initialState: MttrTablesState = {
    mttrTables: [],
    mttrTable: undefined,
    defaultValue: [],
    filters: {},
    columns: undefined,
    mttrData: undefined,
    error: undefined,
    isLoading: false,
};

const mttrTablesSlice = createSlice({
    name: 'mttrTables',
    initialState,
    reducers: {
        getAllMttrTables(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllMttrTables(state, action: PayloadAction<MttrTables>) {
            const { payload } = action;
            state.defaultValue = payload;
            const { filters } = state;
            const grouping = filters.groupBy;

            const data: MttrTables =
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

            const mttrData = Array.from(
                data
                    .reduce((acc: Map<string, any>, row: any, index: number) => {
                        const key = grouping
                            .split(',')
                            .map((g) => row[g])
                            .join(',');
                        const { faultCode, mttr } = row;
                        const dte = faultCode;

                        let tableRow = {
                            id: `${100000 + index}` || `${Math.random()}`,
                            ...intervals,
                            [dte]: +mttr,
                            ...row,
                        };

                        if (acc.has(key)) {
                            tableRow = acc.get(key);
                            tableRow[dte] = +mttr;
                        }

                        acc.set(key, tableRow);
                        return acc;
                    }, new Map<string, any>())
                    .values(),
            );

            state.columns = extraColumns;
            state.mttrTables = mttrData;
        },

        setMttrTable(state, action: PayloadAction<MttrTable>) {
            state.mttrTable = action.payload;
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

export const { actions: mttrTableActions, reducer: mttrTableReducer, name: mttrTableKey } = mttrTablesSlice;
