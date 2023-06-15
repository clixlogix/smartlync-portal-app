import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantFaultByStudTypeSprActions } from 'services/SPR/plant-fault-by-stud-type-spr/plant-fault-by-stud-type-spr-reducer';
import { selectPlantFaultByStudTypeSprFilters } from 'services/SPR/plant-fault-by-stud-type-spr/plant-fault-by-stud-type-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PlantFaultByStudTypeSprs } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllPlantFaultByStudTypeSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantFaultByStudTypeSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectPlantFaultByStudTypeSprFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                plantFaultByStudTypeSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.plantFaultByStudTypeSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plantFaultByStudTypeSprs: PlantFaultByStudTypeSprs = yield call(request, options);

        yield put(plantFaultByStudTypeSprActions.setAllPlantFaultByStudTypeSprs(plantFaultByStudTypeSprs));
    } catch (err: any) {
        console.warn('getAllPlantFaultByStudTypeSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantFaultByStudTypeSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantFaultByStudTypeSprActions.error({
                    name: 'error',
                    message: 'Getting plantFaultByStudTypeSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantFaultByStudTypeSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantFaultByStudTypeSprsSaga() {
    // Watches for getPlantFaultByStudTypeSprs actions and calls getPlantFaultByStudTypeSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        plantFaultByStudTypeSprActions.getAllPlantFaultByStudTypeSprs.type,
        getAllPlantFaultByStudTypeSprs,
    );
}

export default getAllPlantFaultByStudTypeSprsSaga;
