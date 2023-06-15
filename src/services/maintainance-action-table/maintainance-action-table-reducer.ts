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
import { Filters, MaintainanceActionTable, MaintainanceActionTables } from 'models';
import { MaintainanceActionTablesState } from '.';
import { data, dataDemo } from './sagas/data';

let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0];
let staticData = tenant === 'demo' ? dataDemo : data;
// The initial state of the MaintainanceActionTable page
export const initialState: MaintainanceActionTablesState = {
    maintainanceActionTables: staticData,
    maintainanceActionTable: undefined,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const maintainanceActionTablesSlice = createSlice({
    name: 'maintainanceActionTables',
    initialState,
    reducers: {
        getAllMaintainanceActionTables(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllMaintainanceActionTables(state, action: PayloadAction<MaintainanceActionTables>) {
            state.maintainanceActionTables = action.payload;
        },

        setMaintainanceActionTable(state, action: PayloadAction<MaintainanceActionTable>) {
            state.maintainanceActionTable = action.payload;
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
    actions: maintainanceActionTableActions,
    reducer: maintainanceActionTableReducer,
    name: maintainanceActionTableKey,
} = maintainanceActionTablesSlice;
