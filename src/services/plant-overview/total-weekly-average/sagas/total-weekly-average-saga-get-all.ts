import { /*take, */ call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request, getLineFromCarclass } from 'utils';
import Constant from 'constants/index';
import { totalWeeklyAveragesActions } from 'services/plant-overview/total-weekly-average/total-weekly-average-reducer';
import { selectTotalWeeklyAverageFilters } from 'services/plant-overview/total-weekly-average/total-weekly-average-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';
import { camelCase } from 'lodash';

/**
 *  repos request/response handler
 */
export function* getAllTotalWeeklyAverages({ payload }) {
    try {
        // Call our request helper (see 'utils/request')
        yield put(totalWeeklyAveragesActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = getLineFromCarclass({
            ...(yield select(selectTotalWeeklyAverageFilters)),
        });

        // const carTypes = yield select(selectCarTypes);

        if (!!token) {
            yield put(
                totalWeeklyAveragesActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = payload.carTypes.map((item, index) => ({
            url: Constant.totalWeeklyAverages,
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
            totalWeeklyAveragesActions.setAllTotalWeeklyAverages({
                totalWeeklyAverages,
                carTypes: payload.carTypes,
            }),
        );
    } catch (err: any) {
        console.warn('getAllTotalWeeklyAverages.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                totalWeeklyAveragesActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                totalWeeklyAveragesActions.error({
                    name: 'error',
                    message: 'Getting totalWeeklyAverages failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(totalWeeklyAveragesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTotalWeeklyAveragesSaga() {
    // Watches for getTotalWeeklyAverages actions and calls getTotalWeeklyAverages when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(totalWeeklyAveragesActions.getAllTotalWeeklyAverages, getAllTotalWeeklyAverages);
}

export default getAllTotalWeeklyAveragesSaga;
