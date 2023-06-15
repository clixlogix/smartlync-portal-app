import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { selectAggregateColumnActions } from 'services/select-aggregate-column/select-aggregate-column-reducer';
import { selectSelectAggregateColumnFilters } from 'services/select-aggregate-column/select-aggregate-column-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, SelectAggregateColumns } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllSelectAggregateColumns() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(selectAggregateColumnActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectSelectAggregateColumnFilters);

        if (!!token) {
            yield put(
                selectAggregateColumnActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: params.systemType === 'SWS' ? Constant.selectAggregateColumns : Constant.selectAggregateColumnsSpr,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        console.log(
            'getAllSelectAggregateColumns.saga: getting selectAggregateColumns with (token, options) ',
            token,
            options,
        );

        const selectAggregateColumns: SelectAggregateColumns = yield call(request, options);

        console.log(
            'getAllSelectAggregateColumns.saga: got results ( selectAggregateColumns ) ',
            selectAggregateColumns,
        );

        yield put(selectAggregateColumnActions.setAllSelectAggregateColumns(selectAggregateColumns));
    } catch (err) {
        console.warn('getAllSelectAggregateColumns.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                selectAggregateColumnActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                selectAggregateColumnActions.error({
                    name: 'error',
                    message: 'Getting selectAggregateColumns failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(selectAggregateColumnActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllSelectAggregateColumnsSaga() {
    // Watches for getSelectAggregateColumns actions and calls getSelectAggregateColumns when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(selectAggregateColumnActions.getAllSelectAggregateColumns.type, getAllSelectAggregateColumns);
}

export default getAllSelectAggregateColumnsSaga;
