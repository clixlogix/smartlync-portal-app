import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { penetrationActions } from 'services/penetration/penetration-reducer';
import { selectPenetrationFilters } from 'services/penetration/penetration-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, Penetrations } from 'models';
import { getLineFromCarclass } from 'utils';
// import * as _ from 'lodash';

// let filters = {};

/**
 *  repos request/response handler
 */
export function* getAllPenetrations() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(penetrationActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = yield select(selectPenetrationFilters);
        params = getLineFromCarclass(params);

        // if (_.isEqual(params, filters)) {
        //     return yield put(penetrationActions.loading(false));
        // }

        // filters = params;

        if (!!token) {
            yield put(
                penetrationActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.penetrations,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, toTime, fromTime },
        };

        const penetrations: Penetrations = yield call(request, options);

        yield put(penetrationActions.setAllPenetrations(penetrations));
    } catch (err: any) {
        console.warn('getAllPenetrations.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                penetrationActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                penetrationActions.error({
                    name: 'error',
                    message: 'Getting penetrations failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(penetrationActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPenetrationsSaga() {
    // Watches for getPenetrations actions and calls getPenetrations when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(penetrationActions.getAllPenetrations.type, getAllPenetrations);
}

export default getAllPenetrationsSaga;
