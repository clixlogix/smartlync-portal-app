import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantDeviceByDurationSprActions } from 'services/SPR/plant-device-by-duration-spr/plant-device-by-duration-spr-reducer';
import { selectPlantDeviceByDurationSprFilters } from 'services/SPR/plant-device-by-duration-spr/plant-device-by-duration-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PlantDeviceByDurationSprs } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllPlantDeviceByDurationSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantDeviceByDurationSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectPlantDeviceByDurationSprFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                plantDeviceByDurationSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.plantDeviceByDurationSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plantDeviceByDurationSprs: PlantDeviceByDurationSprs = yield call(request, options);

        yield put(plantDeviceByDurationSprActions.setAllPlantDeviceByDurationSprs(plantDeviceByDurationSprs));
    } catch (err: any) {
        console.warn('getAllPlantDeviceByDurationSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantDeviceByDurationSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantDeviceByDurationSprActions.error({
                    name: 'error',
                    message: 'Getting plantDeviceByDurationSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantDeviceByDurationSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantDeviceByDurationSprsSaga() {
    // Watches for getPlantDeviceByDurationSprs actions and calls getPlantDeviceByDurationSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        plantDeviceByDurationSprActions.getAllPlantDeviceByDurationSprs.type,
        getAllPlantDeviceByDurationSprs,
    );
}

export default getAllPlantDeviceByDurationSprsSaga;
