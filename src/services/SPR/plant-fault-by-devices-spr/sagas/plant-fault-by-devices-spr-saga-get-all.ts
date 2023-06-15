import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantFaultByDevicesSprActions } from 'services/SPR/plant-fault-by-devices-spr/plant-fault-by-devices-spr-reducer';
import { selectPlantFaultByDevicesSprFilters } from 'services/SPR/plant-fault-by-devices-spr/plant-fault-by-devices-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PlantFaultByDevicesSprs } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllPlantFaultByDevicesSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantFaultByDevicesSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectPlantFaultByDevicesSprFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                plantFaultByDevicesSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.plantFaultByDevicesSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plantFaultByDevicesSprs: PlantFaultByDevicesSprs = yield call(request, options);

        yield put(plantFaultByDevicesSprActions.setAllPlantFaultByDevicesSprs(plantFaultByDevicesSprs));
    } catch (err: any) {
        console.warn('getAllPlantFaultByDevicesSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantFaultByDevicesSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantFaultByDevicesSprActions.error({
                    name: 'error',
                    message: 'Getting plantFaultByDevicesSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantFaultByDevicesSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantFaultByDevicesSprsSaga() {
    // Watches for getPlantFaultByDevicesSprs actions and calls getPlantFaultByDevicesSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(plantFaultByDevicesSprActions.getAllPlantFaultByDevicesSprs.type, getAllPlantFaultByDevicesSprs);
}

export default getAllPlantFaultByDevicesSprsSaga;
