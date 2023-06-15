import Constant from 'constants/index';
import { EventCountDailyFrequencySprs, eventType, eventTypeGerman, Filters } from 'models';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { eventCountDailySprFrequencyActions } from 'services/event-count-daily-spr-frequency/event-count-daily-spr-frequency-reducer';
import { selectEventCountDailyFrequencySprFilters } from 'services/event-count-daily-spr-frequency/event-count-daily-spr-frequency-selectors';
import { getLineFromCarclass } from 'utils';
import { request } from 'utils/request';

/**
 *  repos request/response handler
 */
export function* getAllEventCountDailyFrequencySprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventCountDailySprFrequencyActions.loading(true));

        const { token } = yield select(selectAuthToken);
        if (!!token) {
            yield put(
                eventCountDailySprFrequencyActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        let { fromTime, toTime, eventTypeCode, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventCountDailyFrequencySprFilters)),
        });

        const options: any = {
            url: Constant.eventCountFrequencyWidgetSpr,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, toTime, fromTime, eventType: eventTypeCode },
        };

        const eventCountDailyFrequencySprs: EventCountDailyFrequencySprs = yield call(request, options);

        yield put(eventCountDailySprFrequencyActions.setAllEventCountDailyFrequencySprs(eventCountDailyFrequencySprs));
    } catch (err: any) {
        console.warn('getAllEventCountDailyFrequencySprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventCountDailySprFrequencyActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventCountDailySprFrequencyActions.error({
                    name: 'error',
                    message: 'Getting eventCountDailyFrequencySprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventCountDailySprFrequencyActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventCountDailyFrequencySprsSaga() {
    // Watches for getEventCountDailyFrequencySprs actions and calls getEventCountDailyFrequencySprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        eventCountDailySprFrequencyActions.getAllEventCountDailyFrequencySprs.type,
        getAllEventCountDailyFrequencySprs,
    );
}

export default getAllEventCountDailyFrequencySprsSaga;
