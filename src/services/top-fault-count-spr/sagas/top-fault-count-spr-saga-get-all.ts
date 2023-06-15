import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { topFaultCountSprActions } from 'services/top-fault-count-spr/top-fault-count-spr-reducer';
import { selectTopFaultCountSprFilters } from 'services/top-fault-count-spr/top-fault-count-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, TopFaultCountSprs, eventTypeGerman, eventType } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllTopFaultCountSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(topFaultCountSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = getLineFromCarclass({ ...(yield select(selectTopFaultCountSprFilters)) });
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
                topFaultCountSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.topFaultCountSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const topFaultCountSprs: TopFaultCountSprs = yield call(request, options);

        yield put(topFaultCountSprActions.setAllTopFaultCountSprs(topFaultCountSprs));
    } catch (err: any) {
        console.warn('getAllTopFaultCountSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                topFaultCountSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                topFaultCountSprActions.error({
                    name: 'error',
                    message: 'Getting topFaultCountSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(topFaultCountSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTopFaultCountSprsSaga() {
    // Watches for getTopFaultCountSprs actions and calls getTopFaultCountSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(topFaultCountSprActions.getAllTopFaultCountSprs.type, getAllTopFaultCountSprs);
}

export default getAllTopFaultCountSprsSaga;
