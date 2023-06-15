import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { recommendedActionsActions } from './recommended-action-reducer';
import { selectRecommendedActionsFilters } from './recommended-action-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getRecommendedActions() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(recommendedActionsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: any = yield select(selectRecommendedActionsFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                recommendedActionsActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: params.systemType === 'SWS' ? Constant.recommendedActions : Constant.recommendedActionsSpr,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: 'token',
                'Accept-Language': params.selectedLanguage,
            },
            params: { ...params, eventType: params.eventTypeCode },
        };

        const recommendedActions: any /* RecommendedActions */ = yield call(request, options);
        yield put(recommendedActionsActions.loading(false));

        yield put(recommendedActionsActions.setRecommendedActions(recommendedActions));
    } catch (err) {
        console.warn('getRecommendedActions.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                recommendedActionsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                recommendedActionsActions.error({
                    name: 'error',
                    message: 'Getting recommendedActions failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(recommendedActionsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* recommendedActionsSaga() {
    // Watches for getRecommendedActions actions and calls getRecommendedActions when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(recommendedActionsActions.recommendedActions.type, getRecommendedActions);
}

export default recommendedActionsSaga;
