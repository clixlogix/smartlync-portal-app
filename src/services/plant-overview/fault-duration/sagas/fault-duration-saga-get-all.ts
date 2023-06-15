import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultDurationActions } from 'services/plant-overview/fault-duration/fault-duration-reducer';
import { selectFaultDurationFilters } from 'services/plant-overview/fault-duration/fault-duration-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, FaultDurations } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllFaultDurations() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(faultDurationActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectFaultDurationFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                faultDurationActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.faultDurations,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const faultDurations: FaultDurations = yield call(request, options);

        yield put(faultDurationActions.setAllFaultDurations(faultDurations));
    } catch (err) {
        console.warn('getAllFaultDurations.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultDurationActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                faultDurationActions.error({
                    name: 'error',
                    message: 'Getting faultDurations failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultDurationActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllFaultDurationsSaga() {
    // Watches for getFaultDurations actions and calls getFaultDurations when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(faultDurationActions.getAllFaultDurations.type, getAllFaultDurations);
}

export default getAllFaultDurationsSaga;
