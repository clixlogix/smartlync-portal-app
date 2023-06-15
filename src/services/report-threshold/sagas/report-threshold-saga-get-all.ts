import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { reportThresholdActions } from 'services/report-threshold/report-threshold-reducer';
import { selectReportThresholdFilters } from 'services/report-threshold/report-threshold-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, ReportThresholds } from 'models';
import data from './data';

/**
 *  repos request/response handler
 */
export function* getAllReportThresholds() {
    let reportThresholds: ReportThresholds = [];

    try {
        // Call our request helper (see 'utils/request')
        yield put(reportThresholdActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectReportThresholdFilters);

        if (!!token) {
            yield put(
                reportThresholdActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.reportThresholds,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        reportThresholds = yield call(request, options);
    } catch (err) {
        console.warn('getAllReportThresholds.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                reportThresholdActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                reportThresholdActions.error({
                    name: 'error',
                    message: 'Getting reportThresholds failed',
                    data: { status, message },
                }),
            );
        }
        reportThresholds = data;
    }

    yield put(reportThresholdActions.setReportThreshold(reportThresholds));

    yield put(reportThresholdActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllReportThresholdsSaga() {
    // Watches for getReportThresholds actions and calls getReportThresholds when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(reportThresholdActions.getAllReportThresholds.type, getAllReportThresholds);
}

export default getAllReportThresholdsSaga;
