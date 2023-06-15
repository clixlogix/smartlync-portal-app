import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { durationOfFaultsSprActions } from 'services/duration-of-faults-spr/duration-of-faults-spr-reducer';
import { selectDurationOfFaultsSprFilters } from 'services/duration-of-faults-spr/duration-of-faults-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, DurationOfFaultsSprs } from 'models';
import { getLineFromCarclass } from 'utils';

export function* getAllDurationOfFaultsSprs() {
    try {
        yield put(durationOfFaultsSprActions.loading(true));
        const { token } = yield select(selectAuthToken);
        if (!!token) {
            yield put(
                durationOfFaultsSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        const { eventTypeCode, ...params }: Filters = getLineFromCarclass(
            yield select(selectDurationOfFaultsSprFilters),
        );
        const options: any = {
            url: Constant.durationOfFaultsSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, eventType: eventTypeCode },
        };

        let durationOfFaultsSprs: DurationOfFaultsSprs = yield call(request, options);
        durationOfFaultsSprs = durationOfFaultsSprs.map((f) => {
            f['faultCode'] = f['eventCode'];
            return f;
        });
        yield put(durationOfFaultsSprActions.setAllDurationOfFaultsSprs(durationOfFaultsSprs));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                durationOfFaultsSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                durationOfFaultsSprActions.error({
                    name: 'error',
                    message: 'Getting durationOfFaultsSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(durationOfFaultsSprActions.loading(false));
}

export function* getAllDurationOfFaultsSprsSaga() {
    yield takeLatest(durationOfFaultsSprActions.getAllDurationOfFaultsSprs.type, getAllDurationOfFaultsSprs);
}

export default getAllDurationOfFaultsSprsSaga;
