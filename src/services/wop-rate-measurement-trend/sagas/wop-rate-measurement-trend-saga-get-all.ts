import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { wopRateMeasurementTrendActions } from 'services/wop-rate-measurement-trend/wop-rate-measurement-trend-reducer';
import { selectWopRateMeasurementTrendFilters } from 'services/wop-rate-measurement-trend/wop-rate-measurement-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, WopRateMeasurementTrends } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllWopRateMeasurementTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(wopRateMeasurementTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectWopRateMeasurementTrendFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                wopRateMeasurementTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.wopRateMeasurementTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const wopRateMeasurementTrends: WopRateMeasurementTrends = yield call(request, options);

        yield put(wopRateMeasurementTrendActions.setAllWopRateMeasurementTrends(wopRateMeasurementTrends));
    } catch (err) {
        console.warn('getAllWopRateMeasurementTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                wopRateMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                wopRateMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Getting wopRateMeasurementTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(wopRateMeasurementTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllWopRateMeasurementTrendsSaga() {
    // Watches for getWopRateMeasurementTrends actions and calls getWopRateMeasurementTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        wopRateMeasurementTrendActions.getAllWopRateMeasurementTrends.type,
        getAllWopRateMeasurementTrends,
    );
}

export default getAllWopRateMeasurementTrendsSaga;
