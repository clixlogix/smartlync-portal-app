import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { studProjectionMeasurementTrendActions } from 'services/stud-projection-measurement-trend/stud-projection-measurement-trend-reducer';
import { selectStudProjectionMeasurementTrendFilters } from 'services/stud-projection-measurement-trend/stud-projection-measurement-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, StudProjectionMeasurementTrends } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllStudProjectionMeasurementTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(studProjectionMeasurementTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectStudProjectionMeasurementTrendFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                studProjectionMeasurementTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.studProjectionMeasurementTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const studProjectionMeasurementTrends: StudProjectionMeasurementTrends = yield call(request, options);

        yield put(
            studProjectionMeasurementTrendActions.setAllStudProjectionMeasurementTrends(
                studProjectionMeasurementTrends,
            ),
        );
    } catch (err) {
        console.warn('getAllStudProjectionMeasurementTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                studProjectionMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                studProjectionMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Getting studProjectionMeasurementTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(studProjectionMeasurementTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllStudProjectionMeasurementTrendsSaga() {
    // Watches for getStudProjectionMeasurementTrends actions and calls getStudProjectionMeasurementTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        studProjectionMeasurementTrendActions.getAllStudProjectionMeasurementTrends.type,
        getAllStudProjectionMeasurementTrends,
    );
}

export default getAllStudProjectionMeasurementTrendsSaga;
