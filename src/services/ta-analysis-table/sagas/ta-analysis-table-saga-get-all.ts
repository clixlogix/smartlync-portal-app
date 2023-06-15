import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { taAnalysisTableActions } from 'services/ta-analysis-table/ta-analysis-table-reducer';
import { selectTaAnalysisTableFilters } from 'services/ta-analysis-table/ta-analysis-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, TaAnalysisTables } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllTaAnalysisTables() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(taAnalysisTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = getLineFromCarclass({ ...(yield select(selectTaAnalysisTableFilters)) });

        if (!!token) {
            yield put(
                taAnalysisTableActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.taAnalysisTables,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const taAnalysisTables: TaAnalysisTables = yield call(request, options);

        yield put(taAnalysisTableActions.setAllTaAnalysisTables(taAnalysisTables));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                taAnalysisTableActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                taAnalysisTableActions.error({
                    name: 'error',
                    message: 'Getting taAnalysisTables failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(taAnalysisTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTaAnalysisTablesSaga() {
    // Watches for getTaAnalysisTables actions and calls getTaAnalysisTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(taAnalysisTableActions.getAllTaAnalysisTables.type, getAllTaAnalysisTables);
}

export default getAllTaAnalysisTablesSaga;
