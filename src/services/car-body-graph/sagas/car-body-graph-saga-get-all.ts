import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { carBodyGraphActions } from 'services/car-body-graph/car-body-graph-reducer';
import { selectCarBodyGraphFilters } from 'services/car-body-graph/car-body-graph-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CarBodyGraphs, FilterNames } from 'models';
import { getFilterParams, getLineFromCarclass } from 'utils';
import moment from 'moment';

/**
 *  repos request/response handler
 */
export function* getAllCarBodyGraphs() {
    const paramNames: FilterNames[] = [
        FilterNames.tenant,
        FilterNames.projectId,
        FilterNames.plantId,
        FilterNames.langCode,
        FilterNames.weldId,
        FilterNames.systemType,
    ];

    try {
        // Call our request helper (see 'utils/request')
        yield put(carBodyGraphActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const { fromTime, toTime, ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectCarBodyGraphFilters)) }),
        );

        if (!!token) {
            yield put(
                carBodyGraphActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.carBodyGraphs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: {
                fromTime: moment(fromTime).format('YYYY-MM-DD HH:mm:ss'),
                toTime: moment(toTime).format('YYYY-MM-DD HH:mm:ss'),
                ...params,
            },
        };

        const carBodyGraphs: CarBodyGraphs = yield call(request, options);

        yield put(carBodyGraphActions.setAllCarBodyGraphs(carBodyGraphs));
    } catch (err: any) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                carBodyGraphActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                carBodyGraphActions.error({
                    name: 'error',
                    message: 'Getting carBodyGraphs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(carBodyGraphActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllCarBodyGraphsSaga() {
    // Watches for getCarBodyGraphs actions and calls getCarBodyGraphs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(carBodyGraphActions.getAllCarBodyGraphs.type, getAllCarBodyGraphs);
}

export default getAllCarBodyGraphsSaga;
