import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { opportunityAnalysisActions } from 'services/opportunity-analysis/opportunity-analysis-reducer';
import { selectOpportunityAnalysisFilters } from 'services/opportunity-analysis/opportunity-analysis-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, OpportunityAnalysiss } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllOpportunityAnalysiss() {
    let opportunityAnalysiss: OpportunityAnalysiss = [];

    try {
        // Call our request helper (see 'utils/request')
        yield put(opportunityAnalysisActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectOpportunityAnalysisFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                opportunityAnalysisActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: params.systemType === 'SWS' ? Constant.opportunityAnalysiss : Constant.opportunityAnalysissSpr,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        opportunityAnalysiss = yield call(request, options);
    } catch (err: any) {
        console.warn('getAllOpportunityAnalysiss.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                opportunityAnalysisActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                opportunityAnalysisActions.error({
                    name: 'error',
                    message: 'Getting opportunityAnalysiss failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(opportunityAnalysisActions.setAllOpportunityAnalysiss(opportunityAnalysiss));

    yield put(opportunityAnalysisActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllOpportunityAnalysissSaga() {
    // Watches for getOpportunityAnalysiss actions and calls getOpportunityAnalysiss when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(opportunityAnalysisActions.getAllOpportunityAnalysiss.type, getAllOpportunityAnalysiss);
}

export default getAllOpportunityAnalysissSaga;
