import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { carBodyDurationWidgetActions } from 'services/car-body-duration-widget/car-body-duration-widget-reducer';
import { selectCarBodyDurationWidgetFilters } from 'services/car-body-duration-widget/car-body-duration-widget-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CarBodyDurationWidget } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllCarBodyDurationWidgets() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(carBodyDurationWidgetActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectCarBodyDurationWidgetFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                carBodyDurationWidgetActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.carBodyDurationWidgets,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const carBodyDurationWidget: CarBodyDurationWidget = yield call(request, options);

        yield put(carBodyDurationWidgetActions.setCarBodyDurationWidget(carBodyDurationWidget));
    } catch (err: any) {
        console.warn('getAllCarBodyDurationWidgets.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                carBodyDurationWidgetActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                carBodyDurationWidgetActions.error({
                    name: 'error',
                    message: 'Getting carBodyDurationWidgets failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(carBodyDurationWidgetActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllCarBodyDurationWidgetsSaga() {
    // Watches for getCarBodyDurationWidgets actions and calls getCarBodyDurationWidgets when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(carBodyDurationWidgetActions.getAllCarBodyDurationWidgets.type, getAllCarBodyDurationWidgets);
}

export default getAllCarBodyDurationWidgetsSaga;
