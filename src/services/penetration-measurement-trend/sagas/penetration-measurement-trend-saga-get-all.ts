import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { penetrationMeasurementTrendActions } from 'services/penetration-measurement-trend/penetration-measurement-trend-reducer';
import { selectPenetrationMeasurementTrendFilters } from 'services/penetration-measurement-trend/penetration-measurement-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PenetrationMeasurementTrends } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllPenetrationMeasurementTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(penetrationMeasurementTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectPenetrationMeasurementTrendFilters);

        if (!!token) {
            yield put(
                penetrationMeasurementTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.penetrationMeasurementTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const penetrationMeasurementTrends: PenetrationMeasurementTrends = yield call(request, options);

        yield put(penetrationMeasurementTrendActions.setAllPenetrationMeasurementTrends(penetrationMeasurementTrends));
    } catch (err) {
        console.warn('getAllPenetrationMeasurementTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                penetrationMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                penetrationMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Getting penetrationMeasurementTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(penetrationMeasurementTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPenetrationMeasurementTrendsSaga() {
    // Watches for getPenetrationMeasurementTrends actions and calls getPenetrationMeasurementTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        penetrationMeasurementTrendActions.getAllPenetrationMeasurementTrends.type,
        getAllPenetrationMeasurementTrends,
    );
}

export default getAllPenetrationMeasurementTrendsSaga;
