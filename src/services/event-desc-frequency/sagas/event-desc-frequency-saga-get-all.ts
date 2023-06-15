import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request, getLineFromCarclass } from 'utils';
import Constant from 'constants/index';
import { eventDescFrequencyActions } from 'services/event-desc-frequency/event-desc-frequency-reducer';
import { selectEventDescFrequencyFilters } from 'services/event-desc-frequency/event-desc-frequency-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, EventDescFrequencys } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllEventDescFrequencys() {
    try {
        yield put(eventDescFrequencyActions.loading(true));

        const { token } = yield select(selectAuthToken);
        if (!!token) {
            yield put(
                eventDescFrequencyActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const { eventTypeCode, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventDescFrequencyFilters)),
        });

        const options: any = {
            url: Constant.eventDescFrequencys,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, eventType: eventTypeCode },
        };

        const eventDescFrequencys: EventDescFrequencys = yield call(request, options);

        yield put(eventDescFrequencyActions.setAllEventDescFrequencys(eventDescFrequencys));
    } catch (err) {
        console.warn('getAllEventDescFrequencys.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventDescFrequencyActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventDescFrequencyActions.error({
                    name: 'error',
                    message: 'Getting eventDescFrequencys failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventDescFrequencyActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventDescFrequencysSaga() {
    // Watches for getEventDescFrequencys actions and calls getEventDescFrequencys when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(eventDescFrequencyActions.getAllEventDescFrequencys.type, getAllEventDescFrequencys);
}

export default getAllEventDescFrequencysSaga;
