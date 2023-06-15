import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { getLastUpdatedActions } from 'services/get-last-updated/get-last-updated-reducer';
import { selectGetLastUpdatedFilters } from 'services/get-last-updated/get-last-updated-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, GetLastUpdateds } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllGetLastUpdateds() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(getLastUpdatedActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectGetLastUpdatedFilters);

        if (!!token) {
            yield put(
                getLastUpdatedActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.getLastUpdateds,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const getLastUpdateds: GetLastUpdateds = yield call(request, options);

        yield put(getLastUpdatedActions.setAllGetLastUpdateds(getLastUpdateds));
    } catch (err) {
        console.warn('getAllGetLastUpdateds.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                getLastUpdatedActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                getLastUpdatedActions.error({
                    name: 'error',
                    message: 'Getting getLastUpdateds failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(getLastUpdatedActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllGetLastUpdatedsSaga() {
    // Watches for getGetLastUpdateds actions and calls getGetLastUpdateds when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(getLastUpdatedActions.getAllGetLastUpdateds.type, getAllGetLastUpdateds);
}

export default getAllGetLastUpdatedsSaga;
