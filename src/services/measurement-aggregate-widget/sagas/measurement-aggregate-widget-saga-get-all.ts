import { /* take, */ call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { measurementAggregateWidgetActions } from 'services/measurement-aggregate-widget/measurement-aggregate-widget-reducer';
import { selectMeasurementAggregateWidgetFilters } from 'services/measurement-aggregate-widget/measurement-aggregate-widget-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllMeasurementAggregateWidgets() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(measurementAggregateWidgetActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectMeasurementAggregateWidgetFilters);

        const { aggregateColumn } = params;
        const aggregateColumnArray = aggregateColumn.split(',');
        if (!!token) {
            yield put(
                measurementAggregateWidgetActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = aggregateColumnArray.map((item) => ({
            url: Constant.measurementAggregateWidgets,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, aggregateColumn: item },
        }));
        const eventApiOptions: any = {
            url: Constant.cycleGapEvents,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: {
                ...params,
                groupBy: 'deviceName,station,outletNo,feederNo,studId',
                structured: true,
            },
        };
        const events = yield call(request, eventApiOptions);

        let result: any = {};
        for (let i = 0; i < options.length; i++) {
            try {
                result[options[i].params.aggregateColumn] = yield call(request, options[i]);
            } catch (err) {}
        }

        const AllResult = yield all(result);

        yield put(measurementAggregateWidgetActions.setAllMeasurementAggregateWidgets({ AllResult, events }));
    } catch (err: any) {
        console.warn('getAllMeasurementAggregateWidgets.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                measurementAggregateWidgetActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                measurementAggregateWidgetActions.error({
                    name: 'error',
                    message: 'Getting measurementAggregateWidgets failed',
                    data: { status, message },
                }),
            );
        }
        yield put(measurementAggregateWidgetActions.loading(false));
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMeasurementAggregateWidgetsSaga() {
    // Watches for getMeasurementAggregateWidgets actions and calls getMeasurementAggregateWidgets when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        measurementAggregateWidgetActions.getAllMeasurementAggregateWidgets.type,
        getAllMeasurementAggregateWidgets,
    );
}

export default getAllMeasurementAggregateWidgetsSaga;
