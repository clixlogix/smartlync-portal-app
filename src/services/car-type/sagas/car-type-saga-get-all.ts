import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { carTypeActions } from 'services/car-type/car-type-reducer';
import { selectCarTypeFilters } from 'services/car-type/car-type-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CarTypes } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllCarTypes() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(carTypeActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectCarTypeFilters);

        if (!!token) {
            yield put(carTypeActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.carTypes,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const carTypes: CarTypes = yield call(request, options);

        yield put(carTypeActions.setAllCarTypes(carTypes));
    } catch (err: any) {
        console.warn('getAllCarTypes.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                carTypeActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                carTypeActions.error({ name: 'error', message: 'Getting carTypes failed', data: { status, message } }),
            );
        }
    }

    yield put(carTypeActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllCarTypesSaga() {
    // Watches for getCarTypes actions and calls getCarTypes when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(carTypeActions.getAllCarTypes.type, getAllCarTypes);
}

export default getAllCarTypesSaga;
