import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { mtbfsActions } from 'services/system-overview/mtbf/mtbf-reducer';
import { selectMtbfsFilters } from 'services/system-overview/mtbf/mtbf-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, Mtbfs } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllMtbfs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(mtbfsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectMtbfsFilters);

        if (!!token) {
            yield put(mtbfsActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.mtbfs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const mtbfs: Mtbfs = yield call(request, options);

        yield put(mtbfsActions.setAllMtbfs(mtbfs));
    } catch (err) {
        console.warn('getAllMtbfs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                mtbfsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                mtbfsActions.error({ name: 'error', message: 'Getting mtbfs failed', data: { status, message } }),
            );
        }
    }

    yield put(mtbfsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMtbfsSaga() {
    // Watches for getMtbfs actions and calls getMtbfs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(mtbfsActions.getAllMtbfs.type, getAllMtbfs);
}

export default getAllMtbfsSaga;
