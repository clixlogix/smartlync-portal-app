import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { saTableActions } from 'services/sa-table/sa-table-reducer';
import { selectSaTableFilters } from 'services/sa-table/sa-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, SaTables } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllSaTables() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(saTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectSaTableFilters);

        if (!!token) {
            yield put(saTableActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.saTable,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const saTables: SaTables = yield call(request, options);

        yield put(saTableActions.setAllSaTables(saTables));
    } catch (err) {
        console.warn('getAllSaTables.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                saTableActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                saTableActions.error({ name: 'error', message: 'Getting saTables failed', data: { status, message } }),
            );
        }
    }

    yield put(saTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllSaTablesSaga() {
    // Watches for getSaTables actions and calls getSaTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(saTableActions.getAllSaTables.type, getAllSaTables);
}

export default getAllSaTablesSaga;
