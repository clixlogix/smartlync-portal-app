import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantCycleCountSprActions } from 'services/SPR/plant-cycle-count-spr/plant-cycle-count-spr-reducer';
import { selectPlantCycleCountSprFilters } from 'services/SPR/plant-cycle-count-spr/plant-cycle-count-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PlantCycleCountSprs } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllPlantCycleCountSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantCycleCountSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectPlantCycleCountSprFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                plantCycleCountSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.plantCycleCountSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plantCycleCountSprs: PlantCycleCountSprs = yield call(request, options);
        yield put(plantCycleCountSprActions.setAllPlantCycleCountSprs(plantCycleCountSprs));
    } catch (err: any) {
        console.warn('getAllPlantCycleCountSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantCycleCountSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantCycleCountSprActions.error({
                    name: 'error',
                    message: 'Getting plantCycleCountSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantCycleCountSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantCycleCountSprsSaga() {
    // Watches for getPlantCycleCountSprs actions and calls getPlantCycleCountSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(plantCycleCountSprActions.getAllPlantCycleCountSprs.type, getAllPlantCycleCountSprs);
}

export default getAllPlantCycleCountSprsSaga;
