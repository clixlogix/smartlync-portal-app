import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultReportActions } from 'services/fault-report/fault-report-reducer';
import { selectFaultReportFilters } from 'services/fault-report/fault-report-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, FaultReports } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllFaultReports() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(faultReportActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectFaultReportFilters);

        if (!!token) {
            yield put(
                faultReportActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.faultReports,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const faultReports: FaultReports = yield call(request, options);

        yield put(faultReportActions.setAllFaultReports(faultReports));
    } catch (err) {
        console.warn('getAllFaultReports.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultReportActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                faultReportActions.error({
                    name: 'error',
                    message: 'Getting faultReports failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultReportActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllFaultReportsSaga() {
    // Watches for getFaultReports actions and calls getFaultReports when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(faultReportActions.getAllFaultReports.type, getAllFaultReports);
}

export default getAllFaultReportsSaga;
