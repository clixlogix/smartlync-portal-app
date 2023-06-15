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
import { Rule } from 'components/panels/RulesPanel/RulesPanel';
import filter from 'lodash/filter';
import { Filters, TtrTableSpr, TtrTableSprs } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { filterByRule } from 'utils/filterByRule';
import { TtrTableSprsState } from '.';

// The initial state of the TtrTableSpr page
export const initialState: TtrTableSprsState = {
    ttrTableSprs: [],
    ttrTableSpr: undefined,
    ttrTableSprsFilteredByRules: [],
    defaultValue: [],
    filters: {},
    columns: undefined,
    ttrData: undefined,
    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const ttrTableSprsSlice = createSlice({
    name: 'ttrTableSprs',
    initialState,
    reducers: {
        getAllTtrTableSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllTtrTableSprs(state, action: PayloadAction<TtrTableSprs>) {
            const { payload } = action;
            state.defaultValue = payload;
            const { filters } = state;
            const grouping = filters.groupBy;
            const data: TtrTableSprs =
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
            state.ttrTableSprs = ttrData;
        },

        setTtrTableSpr(state, action: PayloadAction<TtrTableSpr>) {
            state.ttrTableSpr = action.payload;
        },

        filterTtrTableSprsByRules(state: any, action: PayloadAction<Rule[]>) {
            state.ttrTableSprsFilteredByRules = filterByRule(state.ttrTableSprs, action.payload);
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

export const { actions: ttrTableSprActions, reducer: ttrTableSprReducer, name: ttrTableSprKey } = ttrTableSprsSlice;
