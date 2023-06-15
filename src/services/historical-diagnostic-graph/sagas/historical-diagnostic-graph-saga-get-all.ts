import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { historicalDiagnosticGraphActions } from 'services/historical-diagnostic-graph/historical-diagnostic-graph-reducer';
import { selectHistoricalDiagnosticGraphFilters } from 'services/historical-diagnostic-graph/historical-diagnostic-graph-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';

export function* getAllHistoricalDiagnosticGraphs() {
    try {
        yield put(historicalDiagnosticGraphActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const param: Filters = yield select(selectHistoricalDiagnosticGraphFilters);
        let params = { ...param };
        let url = Constant.historicalDiagnosticGraphs;
        try {
            if (params.systemType && params.systemType === 'SPR') {
                url = Constant.cycleGapMetaDataSprs;
                params.projectId = params?.studId;
                delete params['studId'];
            }
        } catch (err) {
            console.log(err);
        }
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
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        let historicalDiagnosticGraphs: any = yield call(request, options);

        const option: any = {
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: {
                ...params,
                graphData: false,
            },
        };
        let historicalMetaData: any = yield call(request, option);

        const data = {
            params,
            graphData: historicalDiagnosticGraphs,
            metaData: historicalMetaData[0],
        };

        if (params.systemType === 'SWS') {
            yield put(historicalDiagnosticGraphActions.setAllHistoricalDiagnosticGraphs(data));
        } else {
            yield put(historicalDiagnosticGraphActions.setAllHistoricalSprGraphs(data));
        }
    } catch (err: any) {
        console.warn('getAllHistoricalDiagnosticGraphs.saga.ERROR: got error (err) ', err);

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

export function* getAllHistoricalDiagnosticGraphsSaga() {
    yield takeLatest(
        historicalDiagnosticGraphActions.getAllHistoricalDiagnosticGraphs.type,
        getAllHistoricalDiagnosticGraphs,
    );
}

export default getAllHistoricalDiagnosticGraphsSaga;
