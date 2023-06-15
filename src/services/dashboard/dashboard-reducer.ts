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
import { Filters } from 'models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomError } from 'utils/error';
import { DashboardsState } from '.';
// import routes, { RouteItems } from './routes';
import routes from './routesNew';

// The initial state of the Dashboard page
export const initialState: DashboardsState = {
    dashboards: routes,
    filters: {},

    error: undefined,
    isLoading: false,
};

/*
 *
 *
 */
const dashboardsSlice = createSlice({
    name: 'dashboards',
    initialState,
    reducers: {
        dashboards(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        setDashboards(state, action: PayloadAction<RouteItems>) {
            state.dashboards = routes.map((r) => (r.route !== '/dashboards' ? r : { ...r, children: action.payload }));
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

export const { actions: dashboardsActions, reducer: dashboardsReducer, name: dashboardsKey } = dashboardsSlice;
