import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { historicalDiagnosticActions } from 'services/historical-diagnostic/historical-diagnostic-reducer';
import { selectHistoricalDiagnosticFilters } from 'services/historical-diagnostic/historical-diagnostic-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';

function* getHistoricalDiagnostic() {
    try {
        yield put(historicalDiagnosticActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectHistoricalDiagnosticFilters);

        if (!!token) {
            alert('no token');
            yield put(
                historicalDiagnosticActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.diagnosticGraph,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const historicalDiagnostic: any = yield call(request, options);

        yield put(historicalDiagnosticActions.setHistoricalDiagnostic(historicalDiagnostic));
    } catch (err: any) {
        console.warn('getAllHistoricalDiagnostics.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                historicalDiagnosticActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                historicalDiagnosticActions.error({
                    name: 'error',
                    message: 'Getting historicalDiagnostics failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(historicalDiagnosticActions.loading(false));
}
export function* getHistoricalDiagnosticSaga() {
    yield takeLatest(historicalDiagnosticActions.getHistoricalDiagnostic.type, getHistoricalDiagnostic);
}

export default getHistoricalDiagnosticSaga;
