import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { studIdFaultsActions } from 'services/plant-overview/stud-id-fault/stud-id-fault-reducer';
import { selectStudIdFaultsFilters } from 'services/plant-overview/stud-id-fault/stud-id-fault-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, StudIdFaults } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllStudIdFaults() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(studIdFaultsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectStudIdFaultsFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                studIdFaultsActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.studIdFaults,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const studIdFaults: StudIdFaults = yield call(request, options);

        yield put(studIdFaultsActions.setAllStudIdFaults(studIdFaults));
    } catch (err: any) {
        console.warn('getAllStudIdFaults.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                studIdFaultsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                studIdFaultsActions.error({
                    name: 'error',
                    message: 'Getting studIdFaults failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(studIdFaultsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllStudIdFaultsSaga() {
    // Watches for getStudIdFaults actions and calls getStudIdFaults when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(studIdFaultsActions.getAllStudIdFaults.type, getAllStudIdFaults);
}

export default getAllStudIdFaultsSaga;
