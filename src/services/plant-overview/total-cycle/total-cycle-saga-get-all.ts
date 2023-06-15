import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { totalCyclesActions } from 'services/plant-overview/total-cycle/total-cycle-reducer';
import { selectTotalCyclesFilters } from 'services/plant-overview/total-cycle/total-cycle-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllTotalCycles() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(totalCyclesActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectTotalCyclesFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                totalCyclesActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.totalCycles,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const totalCycles: any = yield call(request, options);

        yield put(totalCyclesActions.setAllTotalCycles(totalCycles));
    } catch (err) {
        console.warn('getAllTotalCycles.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                totalCyclesActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                totalCyclesActions.error({
                    name: 'error',
                    message: 'Getting totalCycles failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(totalCyclesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTotalCyclesSaga() {
    // Watches for getTotalCycles actions and calls getTotalCycles when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(totalCyclesActions.getAllTotalCycles.type, getAllTotalCycles);
}

export default getAllTotalCyclesSaga;
