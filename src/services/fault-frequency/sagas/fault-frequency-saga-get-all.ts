import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultFrequencyActions } from 'services/fault-frequency/fault-frequency-reducer';
import { selectFaultFrequencyFilters } from 'services/fault-frequency/fault-frequency-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllFaultFrequencys() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(faultFrequencyActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectFaultFrequencyFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                faultFrequencyActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.faultFrequencys,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const faultFrequencys: any[] = yield call(request, options);

        yield put(faultFrequencyActions.setAllFaultFrequencys(faultFrequencys));
    } catch (err) {
        console.warn('getAllFaultFrequencys.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultFrequencyActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                faultFrequencyActions.error({
                    name: 'error',
                    message: 'Getting faultFrequencys failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultFrequencyActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllFaultFrequencysSaga() {
    // Watches for getFaultFrequencys actions and calls getFaultFrequencys when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(faultFrequencyActions.getAllFaultFrequencys.type, getAllFaultFrequencys);
}

export default getAllFaultFrequencysSaga;
