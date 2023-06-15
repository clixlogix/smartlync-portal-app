import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { timeZoneActions } from 'services/time-zone/time-zone-reducer';
import { selectTimeZoneFilters } from 'services/time-zone/time-zone-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, TimeZone } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllTimeZones() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(timeZoneActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectTimeZoneFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                timeZoneActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.timeZones,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const timeZones: TimeZone = yield call(request, options);

        yield put(timeZoneActions.setAllTimeZones(timeZones));
    } catch (err) {
        console.warn('getAllTimeZones.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                timeZoneActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                timeZoneActions.error({
                    name: 'error',
                    message: 'Getting timeZones failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(timeZoneActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTimeZonesSaga() {
    // Watches for getTimeZones actions and calls getTimeZones when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(timeZoneActions.getAllTimeZones.type, getAllTimeZones);
}

export default getAllTimeZonesSaga;
