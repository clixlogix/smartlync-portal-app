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
import { BreadcrumbsState } from '.';
import { FilterNames } from 'models';
import { plants, plantsDemo, plantsJLR } from '../plant/data';
// import data from './sagas/data';
// import { filterByRule } from 'utils/filterByRule';
// import { Rule } from 'components/panels/RulesPanel/RulesPanel';

// The initial state of the Breadcrumb page

let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0];
let plantName;
switch (tenant) {
    case 'demo':
        plantName = plantsDemo;
        break;
    case 'jlr':
        plantName = plantsJLR;
        break;
    case 'rivian':
        plantName = plantsJLR;
        break;
    default:
        plantName = plants;
}
export const initialState: BreadcrumbsState = {
    breadcrumbs: [],
    breadcrumb: undefined,
    breadcrumbsFilteredByRules: [],
    filters: { [FilterNames.systemType]: 'SWS', [FilterNames.plantId]: plantName[0].id },
    error: undefined,
    isLoading: false,
};
/*
 *
 *
 */
const breadcrumbsSlice = createSlice({
    name: 'breadcrumbs',
    initialState,
    reducers: {
        getTypeBreadcrumbsFilters(state, action: PayloadAction<any>) {
            const { payload } = action;
            const { filters } = state;
            state.filters = { ...filters, ...payload };
        },

        setBreadcrumb(state, action: PayloadAction<any>) {
            state.breadcrumb = action.payload;
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

export const { actions: breadcrumbActions, reducer: breadcrumbReducer, name: breadcrumbKey } = breadcrumbsSlice;
