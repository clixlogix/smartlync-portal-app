import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { dropTimeMeasurementTrendActions } from 'services/drop-time-measurement-trend/drop-time-measurement-trend-reducer';
import { selectDropTimeMeasurementTrendFilters } from 'services/drop-time-measurement-trend/drop-time-measurement-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, DropTimeMeasurementTrends } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllDropTimeMeasurementTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(dropTimeMeasurementTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectDropTimeMeasurementTrendFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                dropTimeMeasurementTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.dropTimeMeasurementTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const dropTimeMeasurementTrends: DropTimeMeasurementTrends = yield call(request, options);

        yield put(dropTimeMeasurementTrendActions.setAllDropTimeMeasurementTrends(dropTimeMeasurementTrends));
    } catch (err) {
        console.warn('getAllDropTimeMeasurementTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                dropTimeMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                dropTimeMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Getting dropTimeMeasurementTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(dropTimeMeasurementTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllDropTimeMeasurementTrendsSaga() {
    // Watches for getDropTimeMeasurementTrends actions and calls getDropTimeMeasurementTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        dropTimeMeasurementTrendActions.getAllDropTimeMeasurementTrends.type,
        getAllDropTimeMeasurementTrends,
    );
}

export default getAllDropTimeMeasurementTrendsSaga;
