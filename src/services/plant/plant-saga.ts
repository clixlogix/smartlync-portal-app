import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { plantsActions } from './plant-reducer';
import { selectPlantsFilters } from './plant-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FilterNames, Filters, Plants } from 'models';
import { getFilterParams, getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getPlants() {
    const paramNames: FilterNames[] = [FilterNames.fromTime, FilterNames.toTime, FilterNames.systemType];
    try {
        // Call our request helper (see 'utils/request')
        yield put(plantsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectPlantsFilters)) }),
        );
        if (!!token) {
            yield put(plantsActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.plants,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const plants: Plants = yield call(request, options);

        yield put(plantsActions.setPlants(plants));
    } catch (err) {
        console.warn('getPlants.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                plantsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                plantsActions.error({ name: 'error', message: 'Getting plants failed', data: { status, message } }),
            );
        }
    }

    yield put(plantsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* plantsSaga() {
    // Watches for getPlants actions and calls getPlants when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(plantsActions.plants.type, getPlants);
}

export default plantsSaga;
