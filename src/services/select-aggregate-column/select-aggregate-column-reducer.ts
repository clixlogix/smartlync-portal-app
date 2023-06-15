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
import { SelectAggregateColumn, SelectAggregateColumns } from 'models';
import { SelectAggregateColumnsState } from '.';

// The initial state of the SelectAggregateColumn page
export const initialState: SelectAggregateColumnsState = {
    selectAggregateColumns: [],
    selectAggregateColumn: undefined,
    selectAggregateColumnsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const selectAggregateColumnsSlice = createSlice({
    name: 'selectAggregateColumns',
    initialState,
    reducers: {
        getAllSelectAggregateColumns(state, action: PayloadAction<any>) {
            state.filters = action.payload;
        },
        setAllSelectAggregateColumns(state, action: PayloadAction<SelectAggregateColumns>) {
            state.selectAggregateColumns = action.payload;
        },

        setSelectAggregateColumn(state, action: PayloadAction<SelectAggregateColumn>) {
            state.selectAggregateColumn = action.payload;
        },

        // filterSelectAggregateColumnsByRules(state, action: PayloadAction<Rule[]>) {
        //     state.selectAggregateColumnsFilteredByRules = filterByRule(state.selectAggregateColumns, action.payload);
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
    actions: selectAggregateColumnActions,
    reducer: selectAggregateColumnReducer,
    name: selectAggregateColumnKey,
} = selectAggregateColumnsSlice;
