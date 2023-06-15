import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { liftingHeightMeasurementTrendActions } from 'services/lifting-height-measurement-trend/lifting-height-measurement-trend-reducer';
import { selectLiftingHeightMeasurementTrendFilters } from 'services/lifting-height-measurement-trend/lifting-height-measurement-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, LiftingHeightMeasurementTrends } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllLiftingHeightMeasurementTrends() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(liftingHeightMeasurementTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectLiftingHeightMeasurementTrendFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                liftingHeightMeasurementTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.liftingHeightMeasurementTrends,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const liftingHeightMeasurementTrends: LiftingHeightMeasurementTrends = yield call(request, options);

        yield put(
            liftingHeightMeasurementTrendActions.setAllLiftingHeightMeasurementTrends(liftingHeightMeasurementTrends),
        );
    } catch (err) {
        console.warn('getAllLiftingHeightMeasurementTrends.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                liftingHeightMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                liftingHeightMeasurementTrendActions.error({
                    name: 'error',
                    message: 'Getting liftingHeightMeasurementTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(liftingHeightMeasurementTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllLiftingHeightMeasurementTrendsSaga() {
    // Watches for getLiftingHeightMeasurementTrends actions and calls getLiftingHeightMeasurementTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        liftingHeightMeasurementTrendActions.getAllLiftingHeightMeasurementTrends.type,
        getAllLiftingHeightMeasurementTrends,
    );
}

export default getAllLiftingHeightMeasurementTrendsSaga;
