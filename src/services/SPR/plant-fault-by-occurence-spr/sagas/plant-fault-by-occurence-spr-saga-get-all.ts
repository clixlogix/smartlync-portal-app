import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantFaultByOccurenceSprActions } from 'services/SPR/plant-fault-by-occurence-spr/plant-fault-by-occurence-spr-reducer';
import { selectPlantFaultByOccurenceSprFilters } from 'services/SPR/plant-fault-by-occurence-spr/plant-fault-by-occurence-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, PlantFaultByOccurenceSprs } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllPlantFaultByOccurenceSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantFaultByOccurenceSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectPlantFaultByOccurenceSprFilters);

        if (!!token) {
            yield put(
                plantFaultByOccurenceSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.plantFaultByOccurenceSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plantFaultByOccurenceSprs: PlantFaultByOccurenceSprs = yield call(request, options);

        yield put(plantFaultByOccurenceSprActions.setAllPlantFaultByOccurenceSprs(plantFaultByOccurenceSprs));
    } catch (err) {
        console.warn('getAllPlantFaultByOccurenceSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantFaultByOccurenceSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantFaultByOccurenceSprActions.error({
                    name: 'error',
                    message: 'Getting plantFaultByOccurenceSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantFaultByOccurenceSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantFaultByOccurenceSprsSaga() {
    // Watches for getPlantFaultByOccurenceSprs actions and calls getPlantFaultByOccurenceSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        plantFaultByOccurenceSprActions.getAllPlantFaultByOccurenceSprs.type,
        getAllPlantFaultByOccurenceSprs,
    );
}

export default getAllPlantFaultByOccurenceSprsSaga;
