import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultsPerDeviceHistogramActions } from 'services/faults-per-device-histogram/faults-per-device-histogram-reducer';
import { selectFaultsPerDeviceHistogramFilters } from 'services/faults-per-device-histogram/faults-per-device-histogram-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, FaultsPerDeviceHistograms, eventType, eventTypeGerman } from 'models';
import { getLineFromCarclass } from 'utils';
/**
 *  repos request/response handler
 */
export function* getAllFaultsPerDeviceHistograms() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(faultsPerDeviceHistogramActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectFaultsPerDeviceHistogramFilters);
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

        // params.eventType = eventTypeNum;

        if (!!token) {
            yield put(
                faultsPerDeviceHistogramActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.faultsPerDeviceHistograms,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, eventType: eventTypeNum },
        };

        const faultsPerDeviceHistograms: FaultsPerDeviceHistograms = yield call(request, options);

        yield put(faultsPerDeviceHistogramActions.setAllFaultsPerDeviceHistograms(faultsPerDeviceHistograms));
    } catch (err: any) {
        console.warn('getAllFaultsPerDeviceHistograms.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultsPerDeviceHistogramActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                faultsPerDeviceHistogramActions.error({
                    name: 'error',
                    message: 'Getting faultsPerDeviceHistograms failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultsPerDeviceHistogramActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllFaultsPerDeviceHistogramsSaga() {
    // Watches for getFaultsPerDeviceHistograms actions and calls getFaultsPerDeviceHistograms when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        faultsPerDeviceHistogramActions.getAllFaultsPerDeviceHistograms.type,
        getAllFaultsPerDeviceHistograms,
    );
}

export default getAllFaultsPerDeviceHistogramsSaga;
