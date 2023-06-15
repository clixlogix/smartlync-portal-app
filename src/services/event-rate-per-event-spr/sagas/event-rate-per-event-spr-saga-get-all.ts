import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { eventRatePerEventSprActions } from 'services/event-rate-per-event-spr/event-rate-per-event-spr-reducer';
import { selectEventRatePerEventSprFilters } from 'services/event-rate-per-event-spr/event-rate-per-event-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, EventRatePerEventSprs } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllEventRatePerEventSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventRatePerEventSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectEventRatePerEventSprFilters);

        if (!!token) {
            yield put(
                eventRatePerEventSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.eventRatePerEventSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };
        const eventRatePerEventSprs: EventRatePerEventSprs = yield call(request, options);
        yield put(eventRatePerEventSprActions.setAllEventRatePerEventSprs(eventRatePerEventSprs));
    } catch (err: any) {
        console.warn('getAllEventRatePerEventSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventRatePerEventSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventRatePerEventSprActions.error({
                    name: 'error',
                    message: 'Getting eventRatePerEventSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventRatePerEventSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventRatePerEventSprsSaga() {
    // Watches for getEventRatePerEventSprs actions and calls getEventRatePerEventSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(eventRatePerEventSprActions.getAllEventRatePerEventSprs.type, getAllEventRatePerEventSprs);
}

export default getAllEventRatePerEventSprsSaga;
