import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { topFaultCountActions } from 'services/top-fault-count/top-fault-count-reducer';
import { selectTopFaultCountFilters } from 'services/top-fault-count/top-fault-count-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { getLineFromCarclass } from 'utils';
import { Filters, TopFaultCounts, eventTypeGerman, eventType } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllTopFaultCounts() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(topFaultCountActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = getLineFromCarclass({ ...(yield select(selectTopFaultCountFilters)) });

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

        params.eventType = eventTypeNum;
        if (!!token) {
            yield put(
                topFaultCountActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.topFaultCounts,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const topFaultCounts: TopFaultCounts = yield call(request, options);

        yield put(topFaultCountActions.setAllTopFaultCounts(topFaultCounts));
    } catch (err: any) {
        console.warn('getAllTopFaultCounts.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                topFaultCountActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                topFaultCountActions.error({
                    name: 'error',
                    message: 'Getting topFaultCounts failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(topFaultCountActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTopFaultCountsSaga() {
    // Watches for getTopFaultCounts actions and calls getTopFaultCounts when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(topFaultCountActions.getAllTopFaultCounts.type, getAllTopFaultCounts);
}

export default getAllTopFaultCountsSaga;
