import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { eventRateCycleCountSprActions } from 'services/event-rate-cycle-count-spr/event-rate-cycle-count-spr-reducer';
import { selectEventRateCycleCountSprFilters } from 'services/event-rate-cycle-count-spr/event-rate-cycle-count-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, EventRateCycleCountSprs } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllEventRateCycleCountSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(eventRateCycleCountSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let { fromTime, toTime, ...params }: Filters = getLineFromCarclass({
            ...(yield select(selectEventRateCycleCountSprFilters)),
        });

        if (!!token) {
            yield put(
                eventRateCycleCountSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.eventRateCycleCountSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromTime, toTime },
        };

        const eventRateCycleCountSprs: EventRateCycleCountSprs = yield call(request, options);

        yield put(eventRateCycleCountSprActions.setAllEventRateCycleCountSprs(eventRateCycleCountSprs));
    } catch (err: any) {
        console.warn('getAllEventRateCycleCountSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventRateCycleCountSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventRateCycleCountSprActions.error({
                    name: 'error',
                    message: 'Getting eventRateCycleCountSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventRateCycleCountSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEventRateCycleCountSprsSaga() {
    // Watches for getEventRateCycleCountSprs actions and calls getEventRateCycleCountSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(eventRateCycleCountSprActions.getAllEventRateCycleCountSprs.type, getAllEventRateCycleCountSprs);
}

export default getAllEventRateCycleCountSprsSaga;
