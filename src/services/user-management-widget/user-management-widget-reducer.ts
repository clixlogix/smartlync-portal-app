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
import { Filters, UserManagementWidget, UserManagementWidgets } from 'models';
import { UserManagementWidgetsState } from '.';
import data from './sagas/data';
import { filterByRule } from 'utils/filterByRule';
import { Rule } from 'components/panels/RulesPanel/RulesPanel';

// The initial state of the UserManagementWidget page
export const initialState: UserManagementWidgetsState = {
    userManagementWidgets: data,
    userManagementWidget: undefined,
    userManagementWidgetsFilteredByRules: [],
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const userManagementWidgetsSlice = createSlice({
    name: 'userManagementWidgets',
    initialState,
    reducers: {
        getAllUserManagementWidgets(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setAllUserManagementWidgets(state, action: PayloadAction<UserManagementWidgets>) {
            state.userManagementWidgets = action.payload;
        },
        getUserManagementWidget(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setUserManagementWidget(state, action: PayloadAction<UserManagementWidget>) {
            state.userManagementWidget = action.payload;
        },

        filterUserManagementWidgetsByRules(state, action: PayloadAction<Rule[]>) {
            state.userManagementWidgetsFilteredByRules = filterByRule(state.userManagementWidgets, action.payload);
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
    actions: userManagementWidgetActions,
    reducer: userManagementWidgetReducer,
    name: userManagementWidgetKey,
} = userManagementWidgetsSlice;
