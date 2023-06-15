import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { weldingTimeMeasurementTrendActions } from 'services/welding-time-measurement-trend/welding-time-measurement-trend-reducer';
import { selectWeldingTimeMeasurementTrendFilters } from 'services/welding-time-measurement-trend/welding-time-measurement-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, WeldingTimeMeasurementTrends } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllWeldingTimeMeasurementTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(weldingTimeMeasurementTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectWeldingTimeMeasurementTrendFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                weldingTimeMeasurementTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.weldingTimeMeasurementTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const weldingTimeMeasurementTrends: WeldingTimeMeasurementTrends = yield call(request, options);

        yield put(weldingTimeMeasurementTrendActions.setAllWeldingTimeMeasurementTrends(weldingTimeMeasurementTrends));
    } catch (err) {
        console.warn('getAllWeldingTimeMeasurementTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                weldingTimeMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                weldingTimeMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Getting weldingTimeMeasurementTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(weldingTimeMeasurementTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllWeldingTimeMeasurementTrendsSaga() {
    // Watches for getWeldingTimeMeasurementTrends actions and calls getWeldingTimeMeasurementTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        weldingTimeMeasurementTrendActions.getAllWeldingTimeMeasurementTrends.type,
        getAllWeldingTimeMeasurementTrends,
    );
}

export default getAllWeldingTimeMeasurementTrendsSaga;
