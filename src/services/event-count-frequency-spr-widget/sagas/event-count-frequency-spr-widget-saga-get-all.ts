import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { eventCountFrequencySprWidgetActions } from 'services/event-count-frequency-spr-widget/event-count-frequency-spr-widget-reducer';
import { selectEventCountFrequencySprWidgetFilters } from 'services/event-count-frequency-spr-widget/event-count-frequency-spr-widget-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { EventCountFrequencySprs, eventType, eventTypeGerman, Filters } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllEventCountFrequencySprWidgets() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventCountFrequencySprWidgetActions.loading(true));
        const { token } = yield select(selectAuthToken);

        if (!!token) {
            yield put(
                eventCountFrequencySprWidgetActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        let { fromTime, toTime, eventTypeCode, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventCountFrequencySprWidgetFilters)),
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

        const eventCountFrequencyWidgetSprs: EventCountFrequencySprs = yield call(request, options);

        yield put(
            eventCountFrequencySprWidgetActions.setAllEventCountFrequencySprWidgets(eventCountFrequencyWidgetSprs),
        );
    } catch (err: any) {
        console.warn('getAllEventCountDailyFrequencySprModels.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventCountFrequencySprWidgetActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventCountFrequencySprWidgetActions.error({
                    name: 'error',
                    message: 'Getting eventCountDailyFrequencySprModels failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventCountFrequencySprWidgetActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventCountFrequencySprWidgetsSaga() {
    // Watches for getEventCountDailyFrequencySprModels actions and calls getEventCountDailyFrequencySprModels when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        eventCountFrequencySprWidgetActions.getAllEventCountFrequencySprWidgets.type,
        getAllEventCountFrequencySprWidgets,
    );
}

export default getAllEventCountFrequencySprWidgetsSaga;
