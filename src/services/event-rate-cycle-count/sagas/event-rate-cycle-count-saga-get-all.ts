import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request, getLineFromCarclass } from 'utils';
import Constant from 'constants/index';
import { eventRateCycleCountActions } from 'services/event-rate-cycle-count/event-rate-cycle-count-reducer';
import { selectEventRateCycleCountFilters } from 'services/event-rate-cycle-count/event-rate-cycle-count-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, EventRateCycleCounts } from 'models';

export function* getAllEventRateCycleCounts() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventRateCycleCountActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventRateCycleCountFilters)),
        });

        if (!!token) {
            yield put(
                eventRateCycleCountActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.eventRateCycleCounts,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromTime, toTime },
        };

        const eventRateCycleCounts: EventRateCycleCounts = yield call(request, options);
        yield put(eventRateCycleCountActions.setAllEventRateCycleCounts(eventRateCycleCounts));
    } catch (err: any) {
        console.warn('getAllEventRateCycleCounts.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventRateCycleCountActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventRateCycleCountActions.error({
                    name: 'error',
                    message: 'Getting eventRateCycleCounts failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventRateCycleCountActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventRateCycleCountsSaga() {
    // Watches for getEventRateCycleCounts actions and calls getEventRateCycleCounts when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(eventRateCycleCountActions.getAllEventRateCycleCounts.type, getAllEventRateCycleCounts);
}

export default getAllEventRateCycleCountsSaga;
