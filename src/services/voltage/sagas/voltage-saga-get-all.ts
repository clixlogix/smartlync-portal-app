import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { voltageActions } from 'services/voltage/voltage-reducer';
import { selectVoltageFilters } from 'services/voltage/voltage-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, Voltages } from 'models';
import { getLineFromCarclass } from 'utils';

// let filters = {};

/**
 *  repos request/response handler
 */
export function* getAllVoltages() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(voltageActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = yield select(selectVoltageFilters);
        params = getLineFromCarclass(params);

        // if (_.isEqual(params, filters)) {
        //     return yield put(voltageActions.loading(false));
        // }

        // filters = params;

        if (!!token) {
            yield put(voltageActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.voltages,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromTime, toTime },
        };

        const voltages: Voltages = yield call(request, options);

        yield put(voltageActions.setAllVoltages(voltages));
    } catch (err) {
        console.warn('getAllVoltages.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                voltageActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                voltageActions.error({ name: 'error', message: 'Getting voltages failed', data: { status, message } }),
            );
        }
    }

    yield put(voltageActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllVoltagesSaga() {
    // Watches for getVoltages actions and calls getVoltages when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(voltageActions.getAllVoltages.type, getAllVoltages);
}

export default getAllVoltagesSaga;
