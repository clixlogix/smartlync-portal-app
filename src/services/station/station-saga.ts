import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { stationsActions } from './station-reducer';
import { selectStationsFilters } from './station-selectors';
import { selectAuthToken } from '../auth/auth-selectors';
import { Stations, Filters, FilterNames } from 'models';
import { getFilterParams } from 'utils';
import * as _ from 'lodash';
import moment from 'moment';
import { SystemType } from 'constants/staticValues';

let filters: Filters = {
    lastUpdated: moment(),
};

/**
 *  repos request/response handler
 */
export function* getStations(p) {
    const paramNames: FilterNames[] = [FilterNames.systemType, FilterNames.plantId];

    try {
        // Call our request helper (see 'utils/request')
        yield put(stationsActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const params: Filters = getFilterParams(paramNames, yield select(selectStationsFilters));

        // const saveFilter = {
        //     ...params,
        // };

        // if (_.isEqual(saveFilter, filters)) {
        //     // return yield put(stationsActions.loading(false));
        // }

        // filters = saveFilter;
        const systemType = p.payload.systemType;
        const pageList = ['/cycleGapTempo', '/measurements'];
        const systemTypeUrl = systemType === SystemType.SPR ? Constant.weldTagsSpr : Constant.weldTags;
        const options: any = {
            url: pageList.includes(window.location.pathname)
                ? systemTypeUrl
                : params.systemType === 'SWS'
                ? Constant.stations
                : Constant.stationsSprs, //Constant.stations,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: pageList.includes(window.location.pathname) ? { ...params, type: 'station' } : { ...params },
        };
        const stations: Stations = yield call(request, options);

        yield put(stationsActions.setStations(stations));
    } catch (err) {
        console.warn('getStations.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                stationsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                stationsActions.error({ name: 'error', message: 'Getting stations failed', data: { status, message } }),
            );
        }
    }

    yield put(stationsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* stationsSaga() {
    // Watches for getStationsIds actions and calls getStationsIds when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(stationsActions.stations.type, getStations);
}

export default stationsSaga;
