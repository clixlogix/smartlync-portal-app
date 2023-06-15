import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { systemFaultsActions } from 'services/plant-overview/system-fault/system-fault-reducer';
import { selectSystemFaultsFilters } from 'services/plant-overview/system-fault/system-fault-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, SystemFaults } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllSystemFaults() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(systemFaultsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectSystemFaultsFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                systemFaultsActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.systemFaults,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const systemFaults: SystemFaults = yield call(request, options);

        yield put(systemFaultsActions.setAllSystemFaults(systemFaults));
    } catch (err: any) {
        console.warn('getAllSystemFaults.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                systemFaultsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                systemFaultsActions.error({
                    name: 'error',
                    message: 'Getting systemFaults failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(systemFaultsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllSystemFaultsSaga() {
    // Watches for getSystemFaults actions and calls getSystemFaults when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(systemFaultsActions.getAllSystemFaults.type, getAllSystemFaults);
}

export default getAllSystemFaultsSaga;
