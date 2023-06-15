import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { historicalDiagnosticGraphActions } from 'services/historical-diagnostic-graph/historical-diagnostic-graph-reducer';
import { selectHistoricalDiagnosticGraphFilters } from 'services/historical-diagnostic-graph/historical-diagnostic-graph-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, HistoricalDiagnosticGraph } from 'models';

export function* getHistoricalDiagnosticGraphById() {
    try {
        yield put(historicalDiagnosticGraphActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { id, ...params }: Filters = yield select(selectHistoricalDiagnosticGraphFilters);

        if (!!token) {
            yield put(
                historicalDiagnosticGraphActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: `${Constant.historicalDiagnosticGraphs}/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const historicalDiagnosticGraph: HistoricalDiagnosticGraph = yield call(request, options);

        yield put(historicalDiagnosticGraphActions.setHistoricalDiagnosticGraph(historicalDiagnosticGraph));
    } catch (err: any) {
        console.warn('getHistoricalDiagnosticGraphByIds.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                historicalDiagnosticGraphActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                historicalDiagnosticGraphActions.error({
                    name: 'error',
                    message: 'Getting historicalDiagnosticGraphs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(historicalDiagnosticGraphActions.loading(false));
}

export function* getHistoricalDiagnosticGraphByIdSaga() {
    yield takeLatest(
        historicalDiagnosticGraphActions.getHistoricalDiagnosticGraph.type,
        getHistoricalDiagnosticGraphById,
    );
}

export default getHistoricalDiagnosticGraphByIdSaga;
