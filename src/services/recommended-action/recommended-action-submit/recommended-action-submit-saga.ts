import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { recommendedActionSubmitsActions } from './recommended-action-submit-reducer';
import {
    selectRecommendedActionSubmits,
    selectRecommendedActionSubmitsFilters,
} from './recommended-action-submit-selectors';
import {
    selectRecommendedActionsHistorys,
    selectRecommActionDefault,
} from 'services/recommended-action/recommended-actions-history/recommended-actions-history-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FaultActions } from 'models';
import { getLineFromCarclass } from 'utils';
import has from 'lodash/has';
import omit from 'lodash/omit';

/**
 *  repos request/response handler
 */
export function* postFaultActions() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(recommendedActionSubmitsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let historyData: FaultActions = yield select(selectRecommActionDefault);
        let mergedData: FaultActions = yield select(selectRecommendedActionsHistorys);
        let params: any = yield select(selectRecommendedActionSubmitsFilters);
        params = getLineFromCarclass(params);
        let checked: FaultActions = [];
        checked = mergedData.filter((item) => {
            if (!item.actionKey) {
                return item;
            }
            return false;
        });

        let unChecked: FaultActions = [];
        for (let historyItem of historyData) {
            let status = 0;
            for (let dataItem of mergedData) {
                if (historyItem.actionKey === dataItem.actionKey) {
                    status = 1;
                }
            }
            if (status === 0 && historyItem.actionType !== '3') {
                unChecked.push(historyItem);
            }
        }

        const finalDataArray = [...unChecked, ...checked];

        if (!!token) {
            yield put(
                recommendedActionSubmitsActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        let data = finalDataArray;
        if (has(params, 'eventTypeCode')) {
            params.faultCode = params.eventTypeCode;
            params.eventCode = params.eventTypeCode;
            params = omit(params, ['eventTypeCode']);
        }
        const options: any = {
            url: params.systemType === 'SWS' ? Constant.recommendedActionSubmits : Constant.recommendedActionSubmitsSpr,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            data,
        };

        yield call(request, options);
        // TODO: Need to get the data from backend after submit and set to store
        yield put(recommendedActionSubmitsActions.setRecommendedActionSubmits(data));
    } catch (err) {
        console.warn('getRecommendedActionSubmits.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                recommendedActionSubmitsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                recommendedActionSubmitsActions.error({
                    name: 'error',
                    message: 'Getting recommendedActionSubmits failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(recommendedActionSubmitsActions.loading(false));
}

export function* getRecommendedActionSubmits() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(recommendedActionSubmitsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: any = yield select(selectRecommendedActionSubmits);

        if (!!token) {
            yield put(
                recommendedActionSubmitsActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.recommendedActionSubmits,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const recommendedActionSubmits: any /* RecommendedActionSubmits */ = yield call(request, options);

        yield put(recommendedActionSubmitsActions.setRecommendedActionSubmits(recommendedActionSubmits));
    } catch (err) {
        console.warn('getRecommendedActionSubmits.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                recommendedActionSubmitsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                recommendedActionSubmitsActions.error({
                    name: 'error',
                    message: 'Getting recommendedActionSubmits failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(recommendedActionSubmitsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* recommendedActionSubmitsSaga() {
    // Watches for getRecommendedActionSubmits actions and calls getRecommendedActionSubmits when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(recommendedActionSubmitsActions.recommendedActionSubmits.type, postFaultActions);
}

export function* faultActionsSaga() {
    // Watches for getRecommendedActionSubmits actions and calls getRecommendedActionSubmits when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(recommendedActionSubmitsActions.faultActions.type, getRecommendedActionSubmits);
}

export default recommendedActionSubmitsSaga;
// export default faultActionsSaga;
