import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { eventActions } from 'services/event/event-reducer';
import { selectEventFilters } from 'services/event/event-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, Events } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllEvents() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectEventFilters);

        if (!!token) {
            yield put(eventActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.events,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const events: Events = yield call(request, options);

        yield put(eventActions.setAllEvents(events));
    } catch (err) {
        console.warn('getAllEvents.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                eventActions.error({ name: 'error', message: 'Getting events failed', data: { status, message } }),
            );
        }
    }

    yield put(eventActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventsSaga() {
    // Watches for getEvents actions and calls getEvents when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(eventActions.getAllEvents.type, getAllEvents);
}

export default getAllEventsSaga;
