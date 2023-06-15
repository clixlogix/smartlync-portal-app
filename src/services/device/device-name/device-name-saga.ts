import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { deviceNamesActions } from './device-name-reducer';
import { selectDeviceNamesFilters } from './device-name-selectors';
import { selectAuthToken } from './../../auth/auth-selectors';
import { DeviceNames, FilterNames, Filters } from 'models';
import { getFilterParams } from 'utils';
import { SystemType } from 'constants/staticValues';

/**
 *  repos request/response handler
 */
export function* getDeviceNames(p) {
    const paramNames: FilterNames[] = [FilterNames.systemType, FilterNames.plantId];

    try {
        yield put(deviceNamesActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const params: Filters = getFilterParams(paramNames, yield select(selectDeviceNamesFilters));
        const systemType = p.payload.systemType;
        const pageList = ['/cycleGapTempo', '/measurements'];
        const systemTypeUrl = systemType === SystemType.SPR ? Constant.weldTagsSpr : Constant.weldTags;
        const options: any = {
            url: pageList.includes(window.location.pathname)
                ? systemTypeUrl
                : params.systemType === 'SWS'
                ? Constant.deviceNames
                : Constant.deviceNamesSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: pageList.includes(window.location.pathname) ? { ...params, type: 'deviceName' } : { ...params },
        };
        const deviceNames: DeviceNames = yield call(request, options);

        yield put(deviceNamesActions.setDeviceNames(deviceNames));
    } catch (err) {
        console.warn('getDeviceNames.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                deviceNamesActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                deviceNamesActions.error({
                    name: 'error',
                    message: 'Getting deviceNames failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(deviceNamesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* deviceNamesSaga() {
    // Watches for getDeviceNames actions and calls getDeviceNames when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(deviceNamesActions.deviceNames.type, getDeviceNames);
}

export default deviceNamesSaga;
