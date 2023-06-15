import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { carBodyTableActions } from 'services/car-body-table/car-body-table-reducer';
import { selectCarBodyTableFilters } from 'services/car-body-table/car-body-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CarBodyTables } from 'models';
import data from './data';

/**
 *  repos request/response handler
 */
export function* getAllCarBodyTables() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(carBodyTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectCarBodyTableFilters);

        if (!!token) {
            yield put(
                carBodyTableActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.carBodyTables,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const carBodyTables: CarBodyTables = yield call(request, options);

        yield put(carBodyTableActions.setAllCarBodyTables(carBodyTables));
    } catch (err: any) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                carBodyTableActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                carBodyTableActions.error({
                    name: 'error',
                    message: 'Getting carBodyTables failed',
                    data: { status, message },
                }),
            );
        }

        yield put(carBodyTableActions.setAllCarBodyTables(data));
    }

    yield put(carBodyTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllCarBodyTablesSaga() {
    // Watches for getCarBodyTables actions and calls getCarBodyTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(carBodyTableActions.getAllCarBodyTables.type, getAllCarBodyTables);
}

export default getAllCarBodyTablesSaga;
