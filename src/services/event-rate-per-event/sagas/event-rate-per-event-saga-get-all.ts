import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request, getLineFromCarclass } from 'utils';
import Constant from 'constants/index';
import { eventRatePerEventActions } from 'services/event-rate-per-event/event-rate-per-event-reducer';
import { selectEventRatePerEventFilters } from 'services/event-rate-per-event/event-rate-per-event-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, EventRatePerEvents } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllEventRatePerEvents() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventRatePerEventActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventRatePerEventFilters)),
        });

        if (!!token) {
            yield put(
                eventRatePerEventActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.eventRatePerEvents,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, toTime, fromTime },
        };

        const eventRatePerEvents: EventRatePerEvents = yield call(request, options);

        yield put(eventRatePerEventActions.setAllEventRatePerEvents(eventRatePerEvents));
    } catch (err: any) {
        console.warn('getAllEventRatePerEvents.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventRatePerEventActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventRatePerEventActions.error({
                    name: 'error',
                    message: 'Getting eventRatePerEvents failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventRatePerEventActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventRatePerEventsSaga() {
    // Watches for getEventRatePerEvents actions and calls getEventRatePerEvents when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(eventRatePerEventActions.getAllEventRatePerEvents.type, getAllEventRatePerEvents);
}

export default getAllEventRatePerEventsSaga;
