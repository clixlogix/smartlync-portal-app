import Constant from 'constants/index';
import { EventCountDailyFrequencys, eventType, eventTypeGerman, Filters } from 'models';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { eventCountDailyFrequencyActions } from 'services/event-count-daily-frequency/event-count-daily-frequency-reducer';
import { selectEventCountDailyFrequencyFilters } from 'services/event-count-daily-frequency/event-count-daily-frequency-selectors';
import { getLineFromCarclass, request } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllEventCountDailyFrequencys() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventCountDailyFrequencyActions.loading(true));

        const { token } = yield select(selectAuthToken);

        if (!!token) {
            yield put(
                eventCountDailyFrequencyActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        let { fromTime, toTime, eventTypeCode, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventCountDailyFrequencyFilters)),
        });

        const options: any = {
            url: Constant.eventCountFrequencyWidgets,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, toTime, fromTime, eventType: eventTypeCode },
        };

        const eventCountDailyFrequencys: EventCountDailyFrequencys = yield call(request, options);

        yield put(eventCountDailyFrequencyActions.setAllEventCountDailyFrequencys(eventCountDailyFrequencys));
    } catch (err: any) {
        console.warn('getAllEventCountDailyFrequencys.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventCountDailyFrequencyActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventCountDailyFrequencyActions.error({
                    name: 'error',
                    message: 'Getting eventCountDailyFrequencys failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventCountDailyFrequencyActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventCountDailyFrequencysSaga() {
    // Watches for getEventCountDailyFrequencys actions and calls getEventCountDailyFrequencys when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        eventCountDailyFrequencyActions.getAllEventCountDailyFrequencys.type,
        getAllEventCountDailyFrequencys,
    );
}

export default getAllEventCountDailyFrequencysSaga;
