import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { recommendedActionsHistorysActions } from 'services/recommended-action/recommended-actions-history/recommended-actions-history-reducer';
import { selectRecommendedActionsHistorysFilters } from 'services/recommended-action/recommended-actions-history/recommended-actions-history-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';
import { getLineFromCarclass } from 'utils';
/**
 *  repos request/response handler
 *
 */
export function* getAllRecommendedActionsHistorys() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(recommendedActionsHistorysActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectRecommendedActionsHistorysFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                recommendedActionsHistorysActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url:
                params.systemType === 'SWS'
                    ? Constant.recommendedActionsHistorys
                    : Constant.recommendedActionsHistorysSpr,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, eventType: params.eventTypeCode },
        };

        const recommendedActionsHistorys: any = yield call(request, options);

        yield put(recommendedActionsHistorysActions.setAllRecommendedActionsHistorys(recommendedActionsHistorys));
    } catch (err) {
        console.warn('getAllRecommendedActionsHistorys.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                recommendedActionsHistorysActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                recommendedActionsHistorysActions.error({
                    name: 'error',
                    message: 'Getting recommendedActionsHistorys failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(recommendedActionsHistorysActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllRecommendedActionsHistorysSaga() {
    // Watches for getRecommendedActionsHistorys actions and calls getRecommendedActionsHistorys when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        recommendedActionsHistorysActions.getAllRecommendedActionsHistorys.type,
        getAllRecommendedActionsHistorys,
    );
}

export default getAllRecommendedActionsHistorysSaga;
