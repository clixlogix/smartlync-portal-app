import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request, getLineFromCarclass } from 'utils';
import Constant from 'constants/index';
import { eventDescFrequencySprActions } from 'services/event-desc-frequency-spr/event-desc-frequency-spr-reducer';
import { selectEventDescFrequencySprFilters } from 'services/event-desc-frequency-spr/event-desc-frequency-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, EventDescFrequencySprs } from 'models';

export function* getAllEventDescFrequencySprs() {
    try {
        yield put(eventDescFrequencySprActions.loading(true));
        const { token } = yield select(selectAuthToken);
        if (!!token) {
            yield put(
                eventDescFrequencySprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        const { eventTypeCode, ...params }: Filters = getLineFromCarclass(
            yield select(selectEventDescFrequencySprFilters),
        );
        const options: any = {
            url: Constant.eventDescFrequencySprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, eventType: eventTypeCode },
        };

        const eventDescFrequencySprs: EventDescFrequencySprs = yield call(request, options);

        yield put(eventDescFrequencySprActions.setAllEventDescFrequencySprs(eventDescFrequencySprs));
    } catch (err) {
        console.warn('getAllEventDescFrequencySprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                eventDescFrequencySprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                eventDescFrequencySprActions.error({
                    name: 'error',
                    message: 'Getting eventDescFrequencySprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(eventDescFrequencySprActions.loading(false));
}

export function* getAllEventDescFrequencySprsSaga() {
    yield takeLatest(eventDescFrequencySprActions.getAllEventDescFrequencySprs.type, getAllEventDescFrequencySprs);
}

export default getAllEventDescFrequencySprsSaga;
