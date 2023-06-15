import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { timeZoneSprActions } from 'services/time-zone-spr/time-zone-spr-reducer';
import { selectTimeZoneSprFilters } from 'services/time-zone-spr/time-zone-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, TimeZoneSpr } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllTimeZoneSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(timeZoneSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectTimeZoneSprFilters);

        if (!!token) {
            yield put(
                timeZoneSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.timeZoneSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        console.log('getAllTimeZoneSprs.saga: getting timeZoneSprs with (token, options) ', token, options);

        const timeZoneSprs: TimeZoneSpr = yield call(request, options);

        yield put(timeZoneSprActions.setAllTimeZoneSprs(timeZoneSprs));
    } catch (err) {
        console.warn('getAllTimeZoneSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                timeZoneSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                timeZoneSprActions.error({
                    name: 'error',
                    message: 'Getting timeZoneSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(timeZoneSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTimeZoneSprsSaga() {
    // Watches for getTimeZoneSprs actions and calls getTimeZoneSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(timeZoneSprActions.getAllTimeZoneSprs.type, getAllTimeZoneSprs);
}

export default getAllTimeZoneSprsSaga;
