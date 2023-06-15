import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { cycleGapActions } from 'services/cycle-gap/cycle-gap-reducer';
import { selectCycleGapFilters } from 'services/cycle-gap/cycle-gap-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CycleGaps, CycleGapEvents } from 'models';
import { getLineFromCarclass } from 'utils';
/**
 *  repos request/response handler
 */
export function* getAllCycleGaps() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(cycleGapActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectCycleGapFilters);

        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                cycleGapActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.cycleGaps,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const eventApiOptions: any = {
            url: Constant.cycleGapEvents,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };
        const [cycleGaps, cycleGapEvents]: [CycleGaps, CycleGapEvents] = yield all([
            call(request, options),
            call(request, eventApiOptions),
        ]);
        yield put(cycleGapActions.setAllCycleGaps([cycleGaps, cycleGapEvents]));
    } catch (err) {
        console.warn('getAllCycleGaps.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                cycleGapActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                cycleGapActions.error({
                    name: 'error',
                    message: 'Getting cycleGaps failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(cycleGapActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllCycleGapsSaga() {
    // Watches for getCycleGaps actions and calls getCycleGaps when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(cycleGapActions.getAllCycleGaps.type, getAllCycleGaps);
}

export default getAllCycleGapsSaga;
