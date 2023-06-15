import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantDeviceByDurationActions } from 'services/plant-device-by-duration/plant-device-by-duration-reducer';
import { selectPlantDeviceByDurationFilters } from 'services/plant-device-by-duration/plant-device-by-duration-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PlantDeviceByDurations } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllPlantDeviceByDurations() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantDeviceByDurationActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectPlantDeviceByDurationFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                plantDeviceByDurationActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.plantDeviceByDurations,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plantDeviceByDurations: PlantDeviceByDurations = yield call(request, options);

        yield put(plantDeviceByDurationActions.setAllPlantDeviceByDurations(plantDeviceByDurations));
    } catch (err: any) {
        console.warn('getAllPlantDeviceByDurations.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantDeviceByDurationActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantDeviceByDurationActions.error({
                    name: 'error',
                    message: 'Getting plantDeviceByDurations failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantDeviceByDurationActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantDeviceByDurationsSaga() {
    // Watches for getPlantDeviceByDurations actions and calls getPlantDeviceByDurations when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(plantDeviceByDurationActions.getAllPlantDeviceByDurations.type, getAllPlantDeviceByDurations);
}

export default getAllPlantDeviceByDurationsSaga;
