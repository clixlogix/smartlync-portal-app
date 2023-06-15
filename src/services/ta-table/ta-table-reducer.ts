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
import filter from 'lodash/filter';
import { Filters, TaTable, TaTables } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { TaTablesState } from '.';

// The initial state of the TaTable page
export const initialState: TaTablesState = {
    taTables: [],
    defaultValue: [],
    taTable: undefined,
    filters: {},
    columns: undefined,
    taData: undefined,

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const taTablesSlice = createSlice({
    name: 'taTables',
    initialState,
    reducers: {
        getAllTaTables(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllTaTables(state, action: PayloadAction<TaTables>) {
            const { payload } = action;
            state.defaultValue = payload;
            const { filters } = state;
            const grouping = filters.groupBy;
            const data: TaTables =
                grouping === 'outlet' && filters.systemFaults === 'Exclude'
                    ? filter(payload, function (o) {
                          return o.outlet.split('-')[1] !== 'System';
                      })
                    : payload;

            const taData = Array.from(
                data
                    .reduce((acc: Map<string, any>, row: any, index: number) => {
                        const key = grouping
                            .split(',')
                            .map((g) => row[g])
                            .join(',');
                        const { ta } = row;

                        let tableRow = {
                            id: `${100000 + index}` || `${Math.random()}`,
                            ta: +ta,
                            ...row,
                        };

                        acc.set(key, tableRow);
                        return acc;
                    }, new Map<string, any>())
                    .values(),
            );

            state.taTables = taData;
        },

        setTaTable(state, action: PayloadAction<TaTable>) {
            state.taTable = action.payload;
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

export const { actions: taTableActions, reducer: taTableReducer, name: taTableKey } = taTablesSlice;
