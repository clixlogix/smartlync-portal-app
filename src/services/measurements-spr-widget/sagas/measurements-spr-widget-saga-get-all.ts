import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { measurementsSprWidgetActions } from 'services/measurements-spr-widget/measurements-spr-widget-reducer';
import { selectMeasurementsSprWidgetFilters } from 'services/measurements-spr-widget/measurements-spr-widget-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, MeasurementsSprWidgets } from 'models';
import { getLineFromCarclass } from 'utils';

export function* getAllMeasurementsSprWidgets() {
    try {
        yield put(measurementsSprWidgetActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = getLineFromCarclass(yield select(selectMeasurementsSprWidgetFilters));

        if (!!token) {
            yield put(
                measurementsSprWidgetActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        const options: any = {
            url: Constant.measurementsSprWidgets,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };
        const measurementsSprWidgets: MeasurementsSprWidgets = yield call(request, options);
        yield put(measurementsSprWidgetActions.setAllMeasurementsSprWidgets(measurementsSprWidgets));
    } catch (err: any) {
        const { status = 0, message = '' } = { ...err.response };
        if (status === 401) {
            yield put(
                measurementsSprWidgetActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                measurementsSprWidgetActions.error({
                    name: 'error',
                    message: 'Getting measurementsSprWidgets failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(measurementsSprWidgetActions.loading(false));
}

export function* getAllMeasurementsSprWidgetsSaga() {
    yield takeLatest(measurementsSprWidgetActions.getAllMeasurementsSprWidgets.type, getAllMeasurementsSprWidgets);
}

export default getAllMeasurementsSprWidgetsSaga;
