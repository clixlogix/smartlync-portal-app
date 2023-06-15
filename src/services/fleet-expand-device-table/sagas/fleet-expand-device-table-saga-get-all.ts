// import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { /* take, */ put, select, takeLatest } from 'redux-saga/effects';
// import { request } from 'utils/request';
// import Constant from 'constants/index';
import { fleetExpandDeviceTableActions } from 'services/fleet-expand-device-table/fleet-expand-device-table-reducer';
// import { selectFleetExpandDeviceTableFilters } from 'services/fleet-expand-device-table/fleet-expand-device-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { /* Filters,*/ FleetExpandDeviceTables } from 'models';
// import { Filters, FleetExpandDeviceTables } from 'models';
import data from './data';

/**
 *  repos request/response handler
 */
export function* getAllFleetExpandDeviceTables() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(fleetExpandDeviceTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        // const params: Filters = yield select(selectFleetExpandDeviceTableFilters);

        if (!!token) {
            yield put(
                fleetExpandDeviceTableActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        // const options: any = {
        //     url: Constant.fleetExpandDeviceTables,
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8',
        //         Authorization: token,
        //     },
        //     params,
        // };

        const fleetExpandDeviceTables: FleetExpandDeviceTables = data;

        yield put(fleetExpandDeviceTableActions.setAllFleetExpandDeviceTables(fleetExpandDeviceTables));
    } catch (err: any) {
        console.warn('getAllFleetExpandDeviceTables.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                fleetExpandDeviceTableActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                fleetExpandDeviceTableActions.error({
                    name: 'error',
                    message: 'Getting fleetExpandDeviceTables failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(fleetExpandDeviceTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllFleetExpandDeviceTablesSaga() {
    // Watches for getFleetExpandDeviceTables actions and calls getFleetExpandDeviceTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(fleetExpandDeviceTableActions.getAllFleetExpandDeviceTables.type, getAllFleetExpandDeviceTables);
}

export default getAllFleetExpandDeviceTablesSaga;
