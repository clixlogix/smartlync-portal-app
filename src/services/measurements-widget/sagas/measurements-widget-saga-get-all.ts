import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { measurementsWidgetActions } from 'services/measurements-widget/measurements-widget-reducer';
import { selectMeasurementsWidgetFilters } from 'services/measurements-widget/measurements-widget-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, MeasurementsWidgets } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllMeasurementsWidgets() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(measurementsWidgetActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectMeasurementsWidgetFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                measurementsWidgetActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.measurementsWidgets,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const measurementsWidgets: MeasurementsWidgets = yield call(request, options);

        yield put(measurementsWidgetActions.setAllMeasurementsWidgets(measurementsWidgets));
    } catch (err: any) {
        console.warn('getAllMeasurementsWidgets.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                measurementsWidgetActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                measurementsWidgetActions.error({
                    name: 'error',
                    message: 'Getting measurementsWidgets failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(measurementsWidgetActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMeasurementsWidgetsSaga() {
    // Watches for getMeasurementsWidgets actions and calls getMeasurementsWidgets when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(measurementsWidgetActions.getAllMeasurementsWidgets.type, getAllMeasurementsWidgets);
}

export default getAllMeasurementsWidgetsSaga;
