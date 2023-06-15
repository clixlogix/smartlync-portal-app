import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { measurementTrendActions } from 'services/measurement-trend/measurement-trend-reducer';
import { selectMeasurementTrendFilters } from 'services/measurement-trend/measurement-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, MeasurementTrends } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllMeasurementTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(measurementTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectMeasurementTrendFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                measurementTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.measurementTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const measurementTrends: MeasurementTrends = yield call(request, options);

        yield put(measurementTrendActions.setAllMeasurementTrends(measurementTrends));
    } catch (err) {
        console.warn('getAllMeasurementTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                measurementTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                measurementTrendActions.error({
                    name: 'error',
                    message: 'Getting measurementTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(measurementTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMeasurementTrendsSaga() {
    // Watches for getMeasurementTrends actions and calls getMeasurementTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(measurementTrendActions.getAllMeasurementTrends.type, getAllMeasurementTrends);
}

export default getAllMeasurementTrendsSaga;
