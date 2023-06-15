import { PayloadAction } from '@reduxjs/toolkit';
import { Rule } from 'components/panels/RulesPanel/RulesPanel';
import filter from 'lodash/filter';
import { Filters, TtrTable, TtrTables } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { filterByRule } from 'utils/filterByRule';
import { TtrTablesState } from '.';

export const initialState: TtrTablesState = {
    ttrTables: [],
    ttrTable: undefined,
    ttrTablesFilteredByRules: [],
    defaultValue: [],
    filters: {},
    columns: undefined,
    ttrData: undefined,
    error: undefined,
    isLoading: false,
};

const ttrTablesSlice = createSlice({
    name: 'ttrTables',
    initialState,
    reducers: {
        getAllTtrTables(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllTtrTables(state, action: PayloadAction<TtrTables>) {
            const { payload } = action;
            state.defaultValue = payload;
            const { filters } = state;
            const grouping = filters.groupBy;
            const data: TtrTables =
                grouping === 'outlet' && filters.systemFaults === 'Exclude'
                    ? filter(payload, function (o) {
                          return o.outlet.split('-')[1] !== 'System';
                      })
                    : payload;

            const extCol: Set<string> = new Set<string>();
            const strCol: Set<string> = new Set<string>();

            payload.forEach((row: any) => {
                const { eventCode } = row;

                if (!isNaN(eventCode)) {
                    extCol.add(eventCode);
                    return;
                }

                strCol.add(eventCode);
            });
            const extraColumns: Array<string> = [...Array.from(strCol), ...Array.from(extCol)];
            const defaultTableValues = '';

            const intervals: any = extraColumns.reduce((acc = {}, dte) => {
                acc[dte] = defaultTableValues;
                return acc;
            }, {});

            const reducedData = data
                .reduce((acc: Map<string, any>, row: any, index: number) => {
                    const key = grouping
                        .split(',')
                        .map((g) => row[g])
                        .join(',');
                    const { eventCode, ttr } = row;
                    const dte = eventCode;

                    let tableRow = {
                        id: `${6730 + index}` || `${Math.random()}`,
                        ...intervals,
                        [dte]: +ttr,
                        ...row,
                    };

                    if (acc.has(key)) {
                        tableRow = acc.get(key);
                        tableRow[dte] = +ttr;
                    }

                    acc.set(key, tableRow);
                    return acc;
                }, new Map<string, any>())
                .values();

            const ttrData = Array.from(reducedData);
            state.columns = extraColumns;
            state.ttrTables = ttrData;
        },
        setTtrTable(state, action: PayloadAction<TtrTable>) {
            state.ttrTable = action.payload;
        },

        filterTtrTablesByRules(state: any, action: PayloadAction<Rule[]>) {
            state.ttrTablesFilteredByRules = filterByRule(state?.ttrTables, action.payload);
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

export const { actions: ttrTableActions, reducer: ttrTableReducer, name: ttrTableKey } = ttrTablesSlice;
