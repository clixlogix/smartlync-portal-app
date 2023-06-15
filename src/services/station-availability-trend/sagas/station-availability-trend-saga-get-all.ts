import { Filter } from './../../../models/filter-model';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { stationAvailabilityTrendActions } from 'services/station-availability-trend/station-availability-trend-reducer';
import { selectStationAvailabilityTrendFilters } from 'services/station-availability-trend/station-availability-trend-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, StationAvailabilityTrends, FilterNames } from 'models';
import { getFilterParams, getLineFromCarclass, getMultipleYearWeek } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllStationAvailabilityTrends() {
    const paramNames: FilterNames[] = [
        FilterNames.fromTime,
        FilterNames.toTime,
        FilterNames.deviceName,
        FilterNames.langCode,
        FilterNames.plantId,
        FilterNames.deviceLine,
        FilterNames.deviceSubLine,
        FilterNames.station,
        FilterNames.groupBy,
        FilterNames.headType,
        FilterNames.systemType,
        FilterNames.view,
        FilterNames.fromWeek,
        FilterNames.toWeek,
    ];
    try {
        // Call our request helper (see 'utils/request')
        yield put(stationAvailabilityTrendActions.loading(true));

        const { token } = yield select(selectAuthToken);
        // const { weekRange, systemFaults } = yield select(selectStationAvailabilityTrendFilters);

        // const { fromWeek, toWeek } = getMultipleYearWeek(weekRange);

        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectStationAvailabilityTrendFilters)) }),
        );

        if (!!token) {
            yield put(
                stationAvailabilityTrendActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: params.systemType === 'SWS' ? Constant.taTables : Constant.taTableSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params },
        };

        const stationAvailabilityTrends: StationAvailabilityTrends = yield call(request, options);

        yield put(stationAvailabilityTrendActions.setAllStationAvailabilityTrends(stationAvailabilityTrends));
    } catch (err: any) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                stationAvailabilityTrendActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                stationAvailabilityTrendActions.error({
                    name: 'error',
                    message: 'Getting stationAvailabilityTrends failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(stationAvailabilityTrendActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllStationAvailabilityTrendsSaga() {
    // Watches for getStationAvailabilityTrends actions and calls getStationAvailabilityTrends when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        stationAvailabilityTrendActions.getAllStationAvailabilityTrends.type,
        getAllStationAvailabilityTrends,
    );
}

export default getAllStationAvailabilityTrendsSaga;
