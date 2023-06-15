import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { dashboardsActions } from './dashboard-reducer';
import { selectDashboardsFilters } from './dashboard-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { RouteItem, RouteItems, dashboards, dashboardIcons, extras } from './routes';
import { getFilterParams } from 'utils';
import { FilterNames, Filters } from 'models';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
let filters: Filters = {
    lastUpdated: moment(),
};

/**
 *  repos request/response handler
 */
export function* getDashboards() {
    let routes: RouteItems = [];
    const paramNames: FilterNames[] = [FilterNames.systemType];

    const setDashboardRoute = (children: RouteItems = [], depth: number = 0): RouteItems => {
        if (!children || children?.length === 0) {
            return [];
        }

        return children.map((child: RouteItem, i: number) => {
            let {
                id,
                children = [],
                disabled = false,
                icon = '',
                url = '',
                roles = [],
                route = '/dashboards',
                label = '',
                ...rest
            } = child;

            url = typeof url === 'string' ? url.replaceAll(/[` ]/gm, '').split(',') : url;
            id = child.id || `${10 ^ (depth + i)}`;
            disabled = ['true', true, 'True', 1, '1'].includes(`${disabled}`);
            roles = roles === null ? [] : roles;
            route = route !== '/dashboards' ? route : `/dashboards/${child.id || `${10 ^ (depth + i)}`}`;
            children = setDashboardRoute(children, depth + 1);
            icon = !!icon ? icon : dashboardIcons[label];

            return { ...rest, label, disabled, icon, roles, url, route, id, children } as RouteItem;
        });
    };

    try {
        // Call our request helper (see 'utils/request')
        yield put(dashboardsActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const params: Filters = getFilterParams(paramNames, yield select(selectDashboardsFilters));

        const saveFilter = {
            ...params,
        };

        if (isEqual(saveFilter, filters)) {
            return yield put(dashboardsActions.loading(false));
        }

        filters = saveFilter;

        if (!!token) {
            yield put(
                dashboardsActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.dashboards,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        routes = yield call(request, options);
    } catch (err) {
        console.warn('getDashboards.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                dashboardsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                dashboardsActions.error({
                    name: 'error',
                    message: 'Getting dashboards failed',
                    data: { status, message },
                }),
            );
        }
    }

    if (routes?.length <= 0) {
        routes = dashboards;
    }

    routes = routes.concat(extras);

    yield put(dashboardsActions.setDashboards(setDashboardRoute(routes, 0)));

    yield put(dashboardsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* dashboardsSaga() {
    // Watches for getDashboards actions and calls getDashboards when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(dashboardsActions.dashboards.type, getDashboards);
}

export default dashboardsSaga;
