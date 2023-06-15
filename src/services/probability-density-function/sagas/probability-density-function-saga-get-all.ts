import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { probabilityDensityFunctionActions } from 'services/probability-density-function/probability-density-function-reducer';
import { selectProbabilityDensityFunctionFilters } from 'services/probability-density-function/probability-density-function-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, ProbabilityDensityFunctions } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllProbabilityDensityFunctions() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(probabilityDensityFunctionActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectProbabilityDensityFunctionFilters);

        if (!!token) {
            yield put(
                probabilityDensityFunctionActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.probabilityDensityFunctions,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const probabilityDensityFunctions: ProbabilityDensityFunctions = yield call(request, options);

        yield put(probabilityDensityFunctionActions.setAllProbabilityDensityFunctions(probabilityDensityFunctions));
    } catch (err) {
        console.warn('getAllProbabilityDensityFunctions.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                probabilityDensityFunctionActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                probabilityDensityFunctionActions.error({
                    name: 'error',
                    message: 'Getting probabilityDensityFunctions failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(probabilityDensityFunctionActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllProbabilityDensityFunctionsSaga() {
    // Watches for getProbabilityDensityFunctions actions and calls getProbabilityDensityFunctions when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        probabilityDensityFunctionActions.getAllProbabilityDensityFunctions.type,
        getAllProbabilityDensityFunctions,
    );
}

export default getAllProbabilityDensityFunctionsSaga;
