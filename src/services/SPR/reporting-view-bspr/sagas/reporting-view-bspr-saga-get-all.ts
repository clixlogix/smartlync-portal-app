import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { reportingViewBsprActions } from 'services/SPR/reporting-view-bspr/reporting-view-bspr-reducer';
import { selectReportingViewBsprFilters } from 'services/SPR/reporting-view-bspr/reporting-view-bspr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, ReportingViewBsprs, FilterNames } from 'models';
import { getFilterParams, getLineFromCarclass } from 'utils';
/**
 *  repos request/response handler
 */
export function* getAllReportingViewBsprs() {
    const paramNames: FilterNames[] = [
        FilterNames.deviceName,
        FilterNames.faultAssignment,
        FilterNames.eventType,
        FilterNames.eventTypeCode,
        FilterNames.langCode,
        FilterNames.fromTime,
        FilterNames.toTime,
        FilterNames.plantId,
        FilterNames.weekDay,
        FilterNames.view,
        FilterNames.studType,
        FilterNames.deviceLine,
        FilterNames.deviceSubLine,
        FilterNames.eventCode,
        FilterNames.systemType,
    ];
    try {
        // Call our request helper (see 'utils/request')
        yield put(reportingViewBsprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        // const params: Filters = yield select(selectReportingViewBsprFilters);
        const { fromTime, toTime, faultCode, eventCode, eventTypeCode, ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectReportingViewBsprFilters)) }),
        );

        if (!!token) {
            yield put(
                reportingViewBsprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.reportingViewBsprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { fromTime, toTime, ...params, eventCode, eventType: eventTypeCode },
        };

        const reportingViewBsprs: ReportingViewBsprs = yield call(request, options);

        yield put(reportingViewBsprActions.setAllReportingViewBsprs(reportingViewBsprs));
    } catch (err) {
        console.warn('getAllReportingViewBsprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                reportingViewBsprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                reportingViewBsprActions.error({
                    name: 'error',
                    message: 'Getting reportingViewBsprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(reportingViewBsprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllReportingViewBsprsSaga() {
    // Watches for getReportingViewBsprs actions and calls getReportingViewBsprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(reportingViewBsprActions.getAllReportingViewBsprs.type, getAllReportingViewBsprs);
}

export default getAllReportingViewBsprsSaga;
