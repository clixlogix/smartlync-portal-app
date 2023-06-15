import { /* take, */ all, call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { dReportWidgetActions } from 'services/dreport-widget/dreport-widget-reducer';
import { selectDReportWidgetFilters } from 'services/dreport-widget/dreport-widget-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, DReportWidgets } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllDReportWidgets() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(dReportWidgetActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectDReportWidgetFilters);
        const { studType } = params;
        const studTypeArray = studType.split(',');

        if (!!token) {
            yield put(
                dReportWidgetActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = studTypeArray.map((item) => ({
            url: Constant.dReportWidgets,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, studType: item },
        }));

        const result_weekly: any = {};
        const result_monthly: any = {};
        for (let i = 0; i < options.length; i++) {
            try {
                const weeklyOptions = {
                    ...options[i],
                    params: { ...options[i].params, view: 'weekly' },
                };
                result_weekly[options[i].params.studType] = yield call(request, weeklyOptions);

                const monthlyOptions = {
                    ...options[i],
                    params: { ...options[i].params, view: 'monthly' },
                };
                result_monthly[options[i].params.studType] = yield call(request, monthlyOptions);
            } catch (err) { }
        }

        const WeeklyResult = yield all(result_weekly);
        const MonthlyResult = yield all(result_monthly);

        yield put(dReportWidgetActions.setAllDReportWidgets({ WeeklyResult, MonthlyResult }));
    } catch (err: any) {
        console.warn('getAllDReportWidgets.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                dReportWidgetActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                dReportWidgetActions.error({
                    name: 'error',
                    message: 'Getting dReportWidgets failed',
                    data: { status, message },
                }),
            );
        }
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllDReportWidgetsSaga() {
    // Watches for getDReportWidgets actions and calls getDReportWidgets when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(dReportWidgetActions.getAllDReportWidgets.type, getAllDReportWidgets);
}

export default getAllDReportWidgetsSaga;
