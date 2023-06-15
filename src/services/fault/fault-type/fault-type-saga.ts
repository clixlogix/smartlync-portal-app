import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultTypesActions } from './fault-type-reducer';
import { selectFaultTypesFilters } from './fault-type-selectors';
import { selectAuthToken } from './../../auth/auth-selectors';
import { /* FaultTypes, */ Filters } from 'models';

/**
 *  repos request/response handler
 */
export function* getFaultTypes() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(faultTypesActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectFaultTypesFilters);

        // check to see if user is not authenticated
        // if (!!token) {
        //     yield put(faultTypesActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }) );
        //     return;
        // }

        const options: any = {
            url: Constant.faultTypes,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const faultTypes: any /* FaultTypes */ = yield call(request, options);

        yield put(faultTypesActions.setFaultTypes(faultTypes));
    } catch (err) {
        console.warn('getFaultTypes.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultTypesActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                faultTypesActions.error({
                    name: 'error',
                    message: 'Getting faultTypes failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultTypesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* faultTypesSaga() {
    // Watches for getFaultTypes actions and calls getFaultTypes when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(faultTypesActions.faultTypes.type, getFaultTypes);
}

export default faultTypesSaga;
