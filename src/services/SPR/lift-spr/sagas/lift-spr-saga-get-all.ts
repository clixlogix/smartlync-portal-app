import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { liftSprActions } from 'services/SPR/lift-spr/lift-spr-reducer';
import { selectLiftSprFilters } from 'services/SPR/lift-spr/lift-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, LiftSprs } from 'models';
import { getLineFromCarclass } from 'utils';
/**
 *  repos request/response handler
 */
export function* getAllLiftSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(liftSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = yield select(selectLiftSprFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(liftSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.liftSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, toTime, fromTime },
        };

        console.log('getAllLiftSprs.saga: getting liftSprs with (token, options) ', token, options);

        const liftSprs: LiftSprs = yield call(request, options);

        console.log('getAllLiftSprs.saga: got results ( liftSprs ) ', liftSprs);

        yield put(liftSprActions.setAllLiftSprs(liftSprs));
    } catch (err) {
        console.warn('getAllLiftSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                liftSprActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                liftSprActions.error({ name: 'error', message: 'Getting liftSprs failed', data: { status, message } }),
            );
        }
    }

    yield put(liftSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllLiftSprsSaga() {
    // Watches for getLiftSprs actions and calls getLiftSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(liftSprActions.getAllLiftSprs.type, getAllLiftSprs);
}

export default getAllLiftSprsSaga;
