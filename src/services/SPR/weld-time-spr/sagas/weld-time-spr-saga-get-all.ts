import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { weldTimeSprActions } from 'services/SPR/weld-time-spr/weld-time-spr-reducer';
import { selectWeldTimeSprFilters } from 'services/SPR/weld-time-spr/weld-time-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, WeldTimeSprs } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllWeldTimeSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(weldTimeSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectWeldTimeSprFilters);

        if (!!token) {
            yield put(
                weldTimeSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.weldTimeSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        console.log('getAllWeldTimeSprs.saga: getting weldTimeSprs with (token, options) ', token, options);

        const weldTimeSprs: WeldTimeSprs = yield call(request, options);

        console.log('getAllWeldTimeSprs.saga: got results ( weldTimeSprs ) ', weldTimeSprs);

        yield put(weldTimeSprActions.setAllWeldTimeSprs(weldTimeSprs));
    } catch (err) {
        console.warn('getAllWeldTimeSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                weldTimeSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                weldTimeSprActions.error({
                    name: 'error',
                    message: 'Getting weldTimeSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(weldTimeSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllWeldTimeSprsSaga() {
    // Watches for getWeldTimeSprs actions and calls getWeldTimeSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(weldTimeSprActions.getAllWeldTimeSprs.type, getAllWeldTimeSprs);
}

export default getAllWeldTimeSprsSaga;
