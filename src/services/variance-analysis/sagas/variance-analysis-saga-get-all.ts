import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { varianceAnalysisActions } from 'services/variance-analysis/variance-analysis-reducer';
import { selectVarianceAnalysisFilters } from 'services/variance-analysis/variance-analysis-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, VarianceAnalysiss } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllVarianceAnalysiss() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(varianceAnalysisActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectVarianceAnalysisFilters);

        if (!!token) {
            yield put(
                varianceAnalysisActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.varianceAnalysiss,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const varianceAnalysiss: VarianceAnalysiss = yield call(request, options);

        yield put(varianceAnalysisActions.setAllVarianceAnalysiss(varianceAnalysiss));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                varianceAnalysisActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                varianceAnalysisActions.error({
                    name: 'error',
                    message: 'Getting varianceAnalysiss failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(varianceAnalysisActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllVarianceAnalysissSaga() {
    // Watches for getVarianceAnalysiss actions and calls getVarianceAnalysiss when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(varianceAnalysisActions.getAllVarianceAnalysiss.type, getAllVarianceAnalysiss);
}

export default getAllVarianceAnalysissSaga;
