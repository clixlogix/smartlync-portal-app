import { /* take, */ call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request, getLineFromCarclass } from 'utils';
import Constant from 'constants/index';
import { plantCycleAveragesWidgetSprActions } from 'services/SPR/plant-cycle-averages-widget-spr/plant-cycle-averages-widget-spr-reducer';
import { selectPlantCycleAveragesWidgetSprFilters } from 'services/SPR/plant-cycle-averages-widget-spr/plant-cycle-averages-widget-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';
import { camelCase } from 'lodash';
/**
 *  repos request/response handler
 */
export function* getAllPlantCycleAveragesWidgetSprs({ payload }) {
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantCycleAveragesWidgetSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        // const params: Filters = yield select(selectPlantCycleAveragesWidgetSprFilters);
        const params: Filters = getLineFromCarclass({
            ...(yield select(selectPlantCycleAveragesWidgetSprFilters)),
        });

        // const carTypes = yield select(selectCarTypes);

        if (!!token) {
            yield put(
                plantCycleAveragesWidgetSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = payload.carTypes.map((item, index) => ({
            url: Constant.plantCycleAveragesWidgetSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, line: item.lines },
        }));

        let result: any = {};
        for (let i = 0; i < options.length; i++) {
            try {
                result[camelCase(payload.carTypes[i].name)] = yield call(request, options[i]);
            } catch (err) {}
        }

        const totalWeeklyAverages = yield all(result);
        yield put(
            plantCycleAveragesWidgetSprActions.setAllPlantCycleAveragesWidgetSprs({
                totalWeeklyAverages,
                carTypes: payload.carTypes,
            }),
        );
    } catch (err) {
        console.warn('getAllPlantCycleAveragesWidgetSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantCycleAveragesWidgetSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                plantCycleAveragesWidgetSprActions.error({
                    name: 'error',
                    message: 'Getting plantCycleAveragesWidgetSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(plantCycleAveragesWidgetSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllPlantCycleAveragesWidgetSprsSaga() {
    // Watches for getPlantCycleAveragesWidgetSprs actions and calls getPlantCycleAveragesWidgetSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        plantCycleAveragesWidgetSprActions.getAllPlantCycleAveragesWidgetSprs,
        getAllPlantCycleAveragesWidgetSprs,
    );
}

export default getAllPlantCycleAveragesWidgetSprsSaga;
