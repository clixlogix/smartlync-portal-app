import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { reportingViewSprActions } from 'services/reporting-view-spr/reporting-view-spr-reducer';
import { selectReportingViewSprFilters } from 'services/reporting-view-spr/reporting-view-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FilterNames, Filters, ReportingViewSprs } from 'models';
import { getFilterParams, getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllReportingViewSprs() {
    const paramNames: FilterNames[] = [
        FilterNames.grouping,
        FilterNames.langCode,
        // FilterNames.faultCode,
        FilterNames.fromTime,
        FilterNames.toTime,
        FilterNames.plantId,
        FilterNames.view,
        FilterNames.studType,
        FilterNames.deviceName,
        FilterNames.eventType,
        FilterNames.eventTypeCode,
        FilterNames.eventCode,
        // FilterNames.deviceLine,
        FilterNames.deviceSubLine,
        FilterNames.eventCode,
        FilterNames.systemType,
        FilterNames.station,
        FilterNames.stationName,
    ];
    try {
        // Call our request helper (see 'utils/request')
        yield put(reportingViewSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        // const params: Filters = yield select(selectReportingViewSprFilters);
        const {
            fromTime,
            toTime /*, faultCode*/,
            studType,
            deviceName,
            eventTypeCode,
            station,
            ...params
        }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectReportingViewSprFilters)) }),
        );

        if (!!token) {
            yield put(
                reportingViewSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.reportingViewSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: {
                fromTime,
                toTime,
                ...params,
                // faultCode: faultCode.split(',')[0],
                studType: studType,
                deviceName: deviceName,
                eventType: eventTypeCode,
                stationName: station,
                station,
            },
        };

        console.log('getAllReportingViewSprs.saga: getting reportingViewSprs with (token, options) ', token, options);

        const reportingViewSprs: ReportingViewSprs = yield call(request, options);

        console.log('getAllReportingViewSprs.saga: got results ( reportingViewSprs ) ', reportingViewSprs);

        yield put(reportingViewSprActions.setAllReportingViewSprs(reportingViewSprs));
    } catch (err) {
        console.warn('getAllReportingViewSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                reportingViewSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                reportingViewSprActions.error({
                    name: 'error',
                    message: 'Getting reportingViewSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(reportingViewSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllReportingViewSprsSaga() {
    // Watches for getReportingViewSprs actions and calls getReportingViewSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(reportingViewSprActions.getAllReportingViewSprs.type, getAllReportingViewSprs);
}

export default getAllReportingViewSprsSaga;
