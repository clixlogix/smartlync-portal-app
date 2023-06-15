import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultRatesActions } from './fault-rate-reducer';
import { selectFaultRatesFilters } from './fault-rate-selectors';
import { selectAuthToken } from './../../auth/auth-selectors';
import { FaultRates, FilterNames, Filters } from 'models';
import { getFilterParams, getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getFaultRates() {
    const paramNames: FilterNames[] = [
        FilterNames.grouping,
        FilterNames.langCode,
        // FilterNames.faultCode,
        FilterNames.eventTypeCode,
        FilterNames.fromTime,
        FilterNames.toTime,
        FilterNames.plantId,
        FilterNames.view,
        FilterNames.studType,
        FilterNames.deviceName,
        FilterNames.eventType,
        FilterNames.eventCode,
        // FilterNames.deviceLine,
        FilterNames.deviceSubLine,
        FilterNames.eventCode,
        FilterNames.systemType,
        FilterNames.station,
        FilterNames.stationName,
    ];

    try {
        // Call our request helper (see 'utils/request')
        yield put(faultRatesActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const {
            fromTime,
            toTime /*, faultCode*/,
            studType,
            deviceName,
            eventTypeCode,
            station,
            ...params
        }: Filters = getFilterParams(paramNames, getLineFromCarclass({ ...(yield select(selectFaultRatesFilters)) }));

        const options: any = {
            url: Constant.faultRates,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            // TODO: send faultCode as an array
            params: {
                fromTime,
                toTime,
                ...params,
                studType: studType,
                deviceName: deviceName,
                eventType: eventTypeCode,
                stationName: station,
                station,
            },
        };

        const faultRates: FaultRates = yield call(request, options);

        yield put(faultRatesActions.setFaultRates(faultRates));
    } catch (err) {
        console.warn('getFaultRates.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultRatesActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                faultRatesActions.error({
                    name: 'error',
                    message: 'Getting faultRates failed',
                    data: { status, message },
                }),
            );
        }
        yield put(faultRatesActions.update());
    }

    yield put(faultRatesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* faultRatesSaga() {
    // Watches for getFaultRates actions and calls getFaultRates when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(faultRatesActions.faultRates.type, getFaultRates);
}

export default faultRatesSaga;
