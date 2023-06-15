import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantFaultByDurationSprActions } from 'services/SPR/plant-fault-by-duration-spr/plant-fault-by-duration-spr-reducer';
import { selectPlantFaultByDurationSprFilters } from 'services/SPR/plant-fault-by-duration-spr/plant-fault-by-duration-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PlantFaultByDurationSprs } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllPlantFaultByDurationSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantFaultByDurationSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectPlantFaultByDurationSprFilters);

        if (!!token) {
            yield put(
                plantFaultByDurationSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.plantFaultByDurationSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plantFaultByDurationSprs: PlantFaultByDurationSprs = yield call(request, options);

        yield put(plantFaultByDurationSprActions.setAllPlantFaultByDurationSprs(plantFaultByDurationSprs));
    } catch (err) {
        console.warn('getAllPlantFaultByDurationSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantFaultByDurationSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantFaultByDurationSprActions.error({
                    name: 'error',
                    message: 'Getting plantFaultByDurationSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantFaultByDurationSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantFaultByDurationSprsSaga() {
    // Watches for getPlantFaultByDurationSprs actions and calls getPlantFaultByDurationSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        plantFaultByDurationSprActions.getAllPlantFaultByDurationSprs.type,
        getAllPlantFaultByDurationSprs,
    );
}

export default getAllPlantFaultByDurationSprsSaga;
