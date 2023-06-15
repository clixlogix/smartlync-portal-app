import { /* take, */ call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { measurementAggregateWidgetSprActions } from 'services/measurement-aggregate-widget-spr/measurement-aggregate-widget-spr-reducer';
import { selectMeasurementAggregateWidgetSprFilters } from 'services/measurement-aggregate-widget-spr/measurement-aggregate-widget-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllMeasurementAggregateWidgetSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(measurementAggregateWidgetSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectMeasurementAggregateWidgetSprFilters);
        const { aggregateColumn } = params;
        const aggregateColumnArray = aggregateColumn.split(',');

        if (!!token) {
            yield put(
                measurementAggregateWidgetSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = aggregateColumnArray.map((item) => ({
            url: Constant.measurementsSprWidgets,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, aggregateColumn: item },
        }));

        const eventApiOptions: any = {
            url: Constant.cycleGapSprEvents,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: {
                ...params,
                groupBy: 'deviceName,station,outletNo,program',
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
        yield put(measurementAggregateWidgetSprActions.setAllMeasurementAggregateWidgetSprs({ AllResult, events }));
    } catch (err: any) {
        console.warn('getAllMeasurementAggregateWidgetSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                measurementAggregateWidgetSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                measurementAggregateWidgetSprActions.error({
                    name: 'error',
                    message: 'Getting measurementAggregateWidgetSprs failed',
                    data: { status, message },
                }),
            );
        }
        yield put(measurementAggregateWidgetSprActions.loading(false));
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMeasurementAggregateWidgetSprsSaga() {
    // Watches for getMeasurementAggregateWidgetSprs actions and calls getMeasurementAggregateWidgetSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        measurementAggregateWidgetSprActions.getAllMeasurementAggregateWidgetSprs.type,
        getAllMeasurementAggregateWidgetSprs,
    );
}

export default getAllMeasurementAggregateWidgetSprsSaga;
