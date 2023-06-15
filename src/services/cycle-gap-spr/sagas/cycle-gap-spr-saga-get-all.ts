import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { cycleGapSprActions } from 'services/cycle-gap-spr/cycle-gap-spr-reducer';
import { selectCycleGapSprFilters } from 'services/cycle-gap-spr/cycle-gap-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CycleGapSprs, CycleGapSprEvents } from 'models';
import { getLineFromCarclass } from 'utils';

export function* getAllCycleGapSprs() {
    try {
        yield put(cycleGapSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectCycleGapSprFilters);

        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                cycleGapSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.cycleGapSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };
        const eventApiOptions: any = {
            url: Constant.cycleGapSprEvents,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };
        const [cycleGapSprs, cycleGapSprEvents]: [CycleGapSprs, CycleGapSprEvents] = yield all([
            call(request, options),
            call(request, eventApiOptions),
        ]);
        yield put(cycleGapSprActions.setAllCycleGapSprs([cycleGapSprs, cycleGapSprEvents]));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                cycleGapSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                cycleGapSprActions.error({
                    name: 'error',
                    message: 'Getting cycleGapSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(cycleGapSprActions.loading(false));
}

export function* getAllCycleGapSprsSaga() {
    yield takeLatest(cycleGapSprActions.getAllCycleGapSprs.type, getAllCycleGapSprs);
}

export default getAllCycleGapSprsSaga;
