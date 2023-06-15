import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request, getLineFromCarclass } from 'utils';
import Constant from 'constants/index';
import { eventRatePerDeviceActions } from 'services/event-rate-per-device/event-rate-per-device-reducer';
import { selectEventRatePerDeviceFilters } from 'services/event-rate-per-device/event-rate-per-device-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, EventRatePerDevices } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllEventRatePerDevices() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventRatePerDeviceActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventRatePerDeviceFilters)),
        });

        if (!!token) {
            yield put(
                eventRatePerDeviceActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.eventRatePerDevices,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, toTime, fromTime },
        };

        const eventRatePerDevices: EventRatePerDevices = yield call(request, options);

        yield put(eventRatePerDeviceActions.setAllEventRatePerDevices(eventRatePerDevices));
    } catch (err: any) {
        console.warn('getAllEventRatePerDevices.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventRatePerDeviceActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventRatePerDeviceActions.error({
                    name: 'error',
                    message: 'Getting eventRatePerDevices failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventRatePerDeviceActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventRatePerDevicesSaga() {
    // Watches for getEventRatePerDevices actions and calls getEventRatePerDevices when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(eventRatePerDeviceActions.getAllEventRatePerDevices.type, getAllEventRatePerDevices);
}

export default getAllEventRatePerDevicesSaga;
