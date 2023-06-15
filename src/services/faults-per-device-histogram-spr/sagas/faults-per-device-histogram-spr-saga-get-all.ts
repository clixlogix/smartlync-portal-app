import Constant from 'constants/index';
import { eventType, eventTypeGerman, FaultsPerDeviceHistogramSprs, Filters } from 'models';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { faultsPerDeviceHistogramSprActions } from 'services/faults-per-device-histogram-spr/faults-per-device-histogram-spr-reducer';
import { selectFaultsPerDeviceHistogramSprFilters } from 'services/faults-per-device-histogram-spr/faults-per-device-histogram-spr-selectors';
import { getLineFromCarclass } from 'utils';
import { request } from 'utils/request';

/**
 *  repos request/response handler
 */
export function* getAllFaultsPerDeviceHistogramSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(faultsPerDeviceHistogramSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectFaultsPerDeviceHistogramSprFilters);
        params = getLineFromCarclass(params);

        let eventTypeNum = 0;
        if (params.eventType === eventType.Fault || params.eventType === eventTypeGerman.Fault) {
            eventTypeNum = 0;
        } else if (params.eventType === eventType.Warning || params.eventType === eventTypeGerman.Warning) {
            eventTypeNum = 1;
        } else if (
            params.eventType === eventType.ComponentExchange ||
            params.eventType === eventTypeGerman.ComponentExchange
        ) {
            eventTypeNum = 2;
        } else if (
            params.eventType === eventType.FirmwareUpdate ||
            params.eventType === eventTypeGerman.FirmwareUpdate
        ) {
            eventTypeNum = 3;
        } else if (params.eventType === eventType.Info || params.eventType === eventTypeGerman.Info) {
            eventTypeNum = 4;
        } else if (params.eventType === eventType.Maintenance || params.eventType === eventTypeGerman.Maintenance) {
            eventTypeNum = 5;
        }

        if (!!token) {
            yield put(
                faultsPerDeviceHistogramSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.faultsPerDeviceHistogramSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, eventType: eventTypeNum },
        };

        const faultsPerDeviceHistogramSprs: FaultsPerDeviceHistogramSprs = yield call(request, options);

        yield put(faultsPerDeviceHistogramSprActions.setAllFaultsPerDeviceHistogramSprs(faultsPerDeviceHistogramSprs));
    } catch (err: any) {
        console.warn('getAllFaultsPerDeviceHistogramSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultsPerDeviceHistogramSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                faultsPerDeviceHistogramSprActions.error({
                    name: 'error',
                    message: 'Getting faultsPerDeviceHistogramSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultsPerDeviceHistogramSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllFaultsPerDeviceHistogramSprsSaga() {
    // Watches for getFaultsPerDeviceHistogramSprs actions and calls getFaultsPerDeviceHistogramSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        faultsPerDeviceHistogramSprActions.getAllFaultsPerDeviceHistogramSprs.type,
        getAllFaultsPerDeviceHistogramSprs,
    );
}

export default getAllFaultsPerDeviceHistogramSprsSaga;
