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
import { Filters, TaAnalysisTable, TaAnalysisTables, FilterNames } from 'models';
import { TaAnalysisTablesState } from '.';
import { data } from './sagas/data';

// The initial state of the TaAnalysisTable page
export const initialState: TaAnalysisTablesState = {
    taAnalysisTables: data || [],
    taAnalysisTable: undefined,
    filters: {},
    filterValues: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const taAnalysisTablesSlice = createSlice({
    name: 'taAnalysisTables',
    initialState,
    reducers: {
        getAllTaAnalysisTables(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllTaAnalysisTables(state, action: PayloadAction<TaAnalysisTables>) {
            const { payload = [] } = action;
            const { taAnalysisTables = [], filterValues = {} as any } = payload.reduce(
                (acc, row: any, index) => {
                    acc.taAnalysisTables.push(row);
                    acc.filterValues[FilterNames.studType].add(row['studType']);

                    return acc;
                },
                {
                    taAnalysisTables: [] as TaAnalysisTables,
                    filterValues: {
                        [FilterNames.studType]: new Set(),
                    },
                },
            );

            state.taAnalysisTables = taAnalysisTables;
            state.filterValues = filterValues;

            // state.taAnalysisTables = action.payload;
            state.taAnalysisTables = data;
        },

        setTaAnalysisTable(state, action: PayloadAction<TaAnalysisTable>) {
            state.taAnalysisTable = action.payload;
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
    actions: taAnalysisTableActions,
    reducer: taAnalysisTableReducer,
    name: taAnalysisTableKey,
} = taAnalysisTablesSlice;
