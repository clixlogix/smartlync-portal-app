import Constant from 'constants/index';
import { EventCountFrequencies, eventType, eventTypeGerman, Filters } from 'models';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { eventCountFrequencyWidgetActions } from 'services/event-count-frequency-widget/event-count-frequency-widget-reducer';
import { selectEventCountFrequencyWidgetFilters } from 'services/event-count-frequency-widget/event-count-frequency-widget-selectors';
import { getLineFromCarclass, request } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllEventCountFrequencyWidgets() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventCountFrequencyWidgetActions.loading(true));

        const { token } = yield select(selectAuthToken);

        if (!!token) {
            yield put(
                eventCountFrequencyWidgetActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        let { fromTime, toTime, eventTypeCode, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventCountFrequencyWidgetFilters)),
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

        const eventCountFrequencyWidgets: EventCountFrequencies = yield call(request, options);

        yield put(eventCountFrequencyWidgetActions.setAllEventCountFrequencyWidgets(eventCountFrequencyWidgets));
    } catch (err: any) {
        console.warn('getAllEventCountFrequencyWidgets.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventCountFrequencyWidgetActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventCountFrequencyWidgetActions.error({
                    name: 'error',
                    message: 'Getting eventCountFrequencyWidgets failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventCountFrequencyWidgetActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventCountFrequencyWidgetsSaga() {
    // Watches for getEventCountFrequencyWidgets actions and calls getEventCountFrequencyWidgets when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        eventCountFrequencyWidgetActions.getAllEventCountFrequencyWidgets.type,
        getAllEventCountFrequencyWidgets,
    );
}

export default getAllEventCountFrequencyWidgetsSaga;
