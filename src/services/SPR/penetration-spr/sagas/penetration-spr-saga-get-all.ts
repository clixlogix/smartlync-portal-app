import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { penetrationSprActions } from 'services/SPR/penetration-spr/penetration-spr-reducer';
import { selectPenetrationSprFilters } from 'services/SPR/penetration-spr/penetration-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PenetrationSprs } from 'models';
import { getLineFromCarclass } from 'utils';
/**
 *  repos request/response handler
 */
export function* getAllPenetrationSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(penetrationSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = yield select(selectPenetrationSprFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                penetrationSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.penetrationSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, toTime, fromTime },
        };

        console.log('getAllPenetrationSprs.saga: getting penetrationSprs with (token, options) ', token, options);

        const penetrationSprs: PenetrationSprs = yield call(request, options);

        console.log('getAllPenetrationSprs.saga: got results ( penetrationSprs ) ', penetrationSprs);

        yield put(penetrationSprActions.setAllPenetrationSprs(penetrationSprs));
    } catch (err) {
        console.warn('getAllPenetrationSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                penetrationSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                penetrationSprActions.error({
                    name: 'error',
                    message: 'Getting penetrationSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(penetrationSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPenetrationSprsSaga() {
    // Watches for getPenetrationSprs actions and calls getPenetrationSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(penetrationSprActions.getAllPenetrationSprs.type, getAllPenetrationSprs);
}

export default getAllPenetrationSprsSaga;
