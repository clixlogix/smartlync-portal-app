import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { liftActions } from 'services/lift/lift-reducer';
import { selectLiftFilters } from 'services/lift/lift-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, Lifts } from 'models';
import { getLineFromCarclass } from 'utils';
// import * as _ from 'lodash';

// let filters = {};

/**
 *  repos request/response handler
 */
export function* getAllLifts() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(liftActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = yield select(selectLiftFilters);
        params = getLineFromCarclass(params);
        // if (_.isEqual(params, filters)) {
        //     return yield put(liftActions.loading(false));
        // }

        // filters = params;

        if (!!token) {
            yield put(liftActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.lifts,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, toTime, fromTime },
        };

        const lifts: Lifts = yield call(request, options);

        yield put(liftActions.setAllLifts(lifts));
    } catch (err) {
        console.warn('getAllLifts.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                liftActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(liftActions.error({ name: 'error', message: 'Getting lifts failed', data: { status, message } }));
        }
    }

    yield put(liftActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllLiftsSaga() {
    // Watches for getLifts actions and calls getLifts when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(liftActions.getAllLifts.type, getAllLifts);
}

export default getAllLiftsSaga;
