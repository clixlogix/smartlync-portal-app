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
import { FilterNames, Filters, TaAnalysisTableSpr, TaAnalysisTablesSpr } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { TaAnalysisTableSprsState } from '.';
import data from './sagas/data';

// The initial state of the TaAnalysisTableSpr page
export const initialState: TaAnalysisTableSprsState = {
    taAnalysisTablesSpr: data || [],
    taAnalysisTableSpr: undefined,
    filters: {},
    filterValues: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const taAnalysisTableSprsSlice = createSlice({
    name: 'taAnalysisTableSprs',
    initialState,
    reducers: {
        getAllTaAnalysisTableSprs(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllTaAnalysisTableSprs(state, action: PayloadAction<TaAnalysisTablesSpr>) {
            const { payload = [] } = action;

            const { taAnalysisTablesSpr = [], filterValues = {} as any } = payload.reduce(
                (acc, row: any, index) => {
                    acc.taAnalysisTablesSpr.push(row);
                    acc.filterValues[FilterNames.studType].add(row['studType']);

                    return acc;
                },
                {
                    taAnalysisTablesSpr: [] as TaAnalysisTablesSpr,
                    filterValues: {
                        [FilterNames.studType]: new Set(),
                    },
                },
            );

            state.taAnalysisTablesSpr = taAnalysisTablesSpr;
            state.filterValues = filterValues;

            // state.taAnalysisTables = action.payload;
            state.taAnalysisTablesSpr = data;
        },

        setTaAnalysisTableSpr(state, action: PayloadAction<TaAnalysisTableSpr>) {
            state.taAnalysisTableSpr = action.payload;
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
    actions: taAnalysisTableSprActions,
    reducer: taAnalysisTableSprReducer,
    name: taAnalysisTableSprKey,
} = taAnalysisTableSprsSlice;
