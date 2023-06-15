import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { deviceAreaGraphActions } from 'services/device-area-graph/device-area-graph-reducer';
import { selectDeviceAreaGraphFilters } from 'services/device-area-graph/device-area-graph-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, DeviceAreaGraphs } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllDeviceAreaGraphs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(deviceAreaGraphActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectDeviceAreaGraphFilters);

        if (!!token) {
            yield put(
                deviceAreaGraphActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.deviceAreaGraphs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const deviceAreaGraphs: DeviceAreaGraphs = yield call(request, options);

        yield put(deviceAreaGraphActions.setAllDeviceAreaGraphs(deviceAreaGraphs));
    } catch (err) {
        console.warn('getAllDeviceAreaGraphs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                deviceAreaGraphActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                deviceAreaGraphActions.error({
                    name: 'error',
                    message: 'Getting deviceAreaGraphs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(deviceAreaGraphActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllDeviceAreaGraphsSaga() {
    // Watches for getDeviceAreaGraphs actions and calls getDeviceAreaGraphs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(deviceAreaGraphActions.getAllDeviceAreaGraphs.type, getAllDeviceAreaGraphs);
}

export default getAllDeviceAreaGraphsSaga;
