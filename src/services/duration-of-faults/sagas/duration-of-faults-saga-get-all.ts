import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { durationOfFaultsActions } from 'services/duration-of-faults/duration-of-faults-reducer';
import { selectDurationOfFaultsFilters } from 'services/duration-of-faults/duration-of-faults-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, DurationOfFaults } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllDurationOfFaultss() {
    try {
        yield put(durationOfFaultsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        if (!!token) {
            yield put(
                durationOfFaultsActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        const { eventTypeCode, ...params }: Filters = getLineFromCarclass(yield select(selectDurationOfFaultsFilters));
        const options: any = {
            url: Constant.durationOfFaultss,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, eventType: eventTypeCode },
        };

        let durationOfFaultss: DurationOfFaults = yield call(request, options);
        durationOfFaultss = durationOfFaultss.map((f) => {
            f['faultCode'] = f['eventCode'];
            return f;
        });

        yield put(durationOfFaultsActions.setAllDurationOfFaults(durationOfFaultss));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                durationOfFaultsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                durationOfFaultsActions.error({
                    name: 'error',
                    message: 'Getting durationOfFaultss failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(durationOfFaultsActions.loading(false));
}

export function* getAllDurationOfFaultsSaga() {
    yield takeLatest(durationOfFaultsActions.getAllDurationOfFaults.type, getAllDurationOfFaultss);
}

export default getAllDurationOfFaultsSaga;
