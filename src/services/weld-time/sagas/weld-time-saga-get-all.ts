import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { weldTimeActions } from 'services/weld-time/weld-time-reducer';
import { selectWeldTimeFilters } from 'services/weld-time/weld-time-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, WeldTimes } from 'models';
import { getLineFromCarclass } from 'utils';

// let filters: Filters = {};

/**
 *  repos request/response handler
 */
export function* getAllWeldTimes() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(weldTimeActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = yield select(selectWeldTimeFilters);
        params = getLineFromCarclass(params);

        // if (_.isEqual({ ...params }, filters)) {
        //     return yield put(weldTimeActions.loading(false));
        // }

        // filters = { ...params };

        if (!!token) {
            yield put(
                weldTimeActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.weldTimes,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromTime, toTime },
        };

        const weldTimes: WeldTimes = yield call(request, options);

        yield put(weldTimeActions.setAllWeldTimes(weldTimes));
    } catch (err) {
        console.warn('getAllWeldTimes.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                weldTimeActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                weldTimeActions.error({
                    name: 'error',
                    message: 'Getting weldTimes failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(weldTimeActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllWeldTimesSaga() {
    // Watches for getWeldTimes actions and calls getWeldTimes when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(weldTimeActions.getAllWeldTimes.type, getAllWeldTimes);
}

export default getAllWeldTimesSaga;
