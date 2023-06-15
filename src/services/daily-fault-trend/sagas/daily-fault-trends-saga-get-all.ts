import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { dailyFaultTrendActions } from 'services/daily-fault-trend/daily-fault-trends-reducer';
import { selectDailyFaultTrendFilters } from 'services/daily-fault-trend/daily-fault-trends-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, DailyFaultTrends } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllDailyFaultTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(dailyFaultTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectDailyFaultTrendFilters);

        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                dailyFaultTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.dailyFaultTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const dailyFaultTrends: DailyFaultTrends = yield call(request, options);

        yield put(dailyFaultTrendActions.setAllDailyFaultTrends(dailyFaultTrends));
    } catch (err: any) {
        console.warn('getAllDailyFaultTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                dailyFaultTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                dailyFaultTrendActions.error({
                    name: 'error',
                    message: 'Getting Daily Fault Trends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(dailyFaultTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllDailyFaultTrendsSaga() {
    // Watches for getDailyFaultTrends actions and calls getDailyFaultTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(dailyFaultTrendActions.getAllDailyFaultTrends.type, getAllDailyFaultTrends);
}

export default getAllDailyFaultTrendsSaga;
