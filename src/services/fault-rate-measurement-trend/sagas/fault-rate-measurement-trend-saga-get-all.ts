import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultRateMeasurementTrendActions } from 'services/fault-rate-measurement-trend/fault-rate-measurement-trend-reducer';
import { selectFaultRateMeasurementTrendFilters } from 'services/fault-rate-measurement-trend/fault-rate-measurement-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, FaultRateMeasurementTrends } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllFaultRateMeasurementTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(faultRateMeasurementTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectFaultRateMeasurementTrendFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                faultRateMeasurementTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.faultRateMeasurementTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const faultRateMeasurementTrends: FaultRateMeasurementTrends = yield call(request, options);

        yield put(faultRateMeasurementTrendActions.setAllFaultRateMeasurementTrends(faultRateMeasurementTrends));
    } catch (err) {
        console.warn('getAllFaultRateMeasurementTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultRateMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                faultRateMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Getting faultRateMeasurementTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultRateMeasurementTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllFaultRateMeasurementTrendsSaga() {
    // Watches for getFaultRateMeasurementTrends actions and calls getFaultRateMeasurementTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        faultRateMeasurementTrendActions.getAllFaultRateMeasurementTrends.type,
        getAllFaultRateMeasurementTrends,
    );
}

export default getAllFaultRateMeasurementTrendsSaga;
