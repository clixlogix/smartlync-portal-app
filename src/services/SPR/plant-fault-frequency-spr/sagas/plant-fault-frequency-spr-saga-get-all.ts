import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantFaultFrequencySprActions } from 'services/SPR/plant-fault-frequency-spr/plant-fault-frequency-spr-reducer';
import { selectPlantFaultFrequencySprFilters } from 'services/SPR/plant-fault-frequency-spr/plant-fault-frequency-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PlantFaultFrequencySprs } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllPlantFaultFrequencySprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantFaultFrequencySprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectPlantFaultFrequencySprFilters);

        if (!!token) {
            yield put(
                plantFaultFrequencySprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.plantFaultFrequencySprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plantFaultFrequencySprs: PlantFaultFrequencySprs = yield call(request, options);

        yield put(plantFaultFrequencySprActions.setAllPlantFaultFrequencySprs(plantFaultFrequencySprs));
    } catch (err) {
        console.warn('getAllPlantFaultFrequencySprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantFaultFrequencySprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantFaultFrequencySprActions.error({
                    name: 'error',
                    message: 'Getting plantFaultFrequencySprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantFaultFrequencySprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantFaultFrequencySprsSaga() {
    // Watches for getPlantFaultFrequencySprs actions and calls getPlantFaultFrequencySprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(plantFaultFrequencySprActions.getAllPlantFaultFrequencySprs.type, getAllPlantFaultFrequencySprs);
}

export default getAllPlantFaultFrequencySprsSaga;
