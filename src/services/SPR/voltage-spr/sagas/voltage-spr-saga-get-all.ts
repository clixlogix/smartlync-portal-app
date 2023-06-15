import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { voltageSprActions } from 'services/SPR/voltage-spr/voltage-spr-reducer';
import { selectVoltageSprFilters } from 'services/SPR/voltage-spr/voltage-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, VoltageSprs } from 'models';
import { getLineFromCarclass } from 'utils';
/**
 *  repos request/response handler
 */
export function* getAllVoltageSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(voltageSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = yield select(selectVoltageSprFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                voltageSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.voltageSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromTime, toTime },
        };

        console.log('getAllVoltageSprs.saga: getting voltageSprs with (token, options) ', token, options);

        const voltageSprs: VoltageSprs = yield call(request, options);

        console.log('getAllVoltageSprs.saga: got results ( voltageSprs ) ', voltageSprs);

        yield put(voltageSprActions.setAllVoltageSprs(voltageSprs));
    } catch (err) {
        console.warn('getAllVoltageSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                voltageSprActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                voltageSprActions.error({
                    name: 'error',
                    message: 'Getting voltageSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(voltageSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllVoltageSprsSaga() {
    // Watches for getVoltageSprs actions and calls getVoltageSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(voltageSprActions.getAllVoltageSprs.type, getAllVoltageSprs);
}

export default getAllVoltageSprsSaga;
