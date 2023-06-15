import Constant from 'constants/index';
import { EventRatePerDeviceSprs, Filters } from 'models';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { eventRatePerDeviceSprActions } from 'services/event-rate-per-device-spr/event-rate-per-device-spr-reducer';
import { selectEventRatePerDeviceSprFilters } from 'services/event-rate-per-device-spr/event-rate-per-device-spr-selectors';
import { getLineFromCarclass } from 'utils';
import { request } from 'utils/request';

/**
 *  repos request/response handler
 */
export function* getAllEventRatePerDeviceSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventRatePerDeviceSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventRatePerDeviceSprFilters)),
        });

        if (!!token) {
            yield put(
                eventRatePerDeviceSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        const options: any = {
            url: Constant.eventRatePerDeviceSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromTime, toTime },
        };

        const eventRatePerDeviceSprs: EventRatePerDeviceSprs = yield call(request, options);

        yield put(eventRatePerDeviceSprActions.setAllEventRatePerDeviceSprs(eventRatePerDeviceSprs));
    } catch (err: any) {
        console.warn('getAllEventRatePerDeviceSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventRatePerDeviceSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventRatePerDeviceSprActions.error({
                    name: 'error',
                    message: 'Getting eventRatePerDeviceSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventRatePerDeviceSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventRatePerDeviceSprsSaga() {
    // Watches for getEventRatePerDeviceSprs actions and calls getEventRatePerDeviceSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(eventRatePerDeviceSprActions.getAllEventRatePerDeviceSprs.type, getAllEventRatePerDeviceSprs);
}

export default getAllEventRatePerDeviceSprsSaga;
