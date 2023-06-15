import { /* take, */ call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { cycleGapMetaDataActions } from 'services/cycle-gap-meta-data/cycle-gap-meta-data-reducer';
import { selectCycleGapMetaDataFilters } from 'services/cycle-gap-meta-data/cycle-gap-meta-data-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CycleGapMetaDatas } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllCycleGapMetaDatas() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(cycleGapMetaDataActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectCycleGapMetaDataFilters);
        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                cycleGapMetaDataActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.cycleGapMetaDatas,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const options1: any = {
            url: Constant.cycleGapMetaDatas,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, graphData: true },
        };

        const cycleGapMetaDatas: CycleGapMetaDatas = yield all({
            metaData: call(request, options),
            graphData: call(request, options1),
        });

        yield put(cycleGapMetaDataActions.setAllCycleGapMetaDatas(cycleGapMetaDatas));
    } catch (err: any) {
        console.warn('getAllCycleGapMetaDatas.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                cycleGapMetaDataActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                cycleGapMetaDataActions.error({
                    name: 'error',
                    message: 'Getting cycleGapMetaDatas failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(cycleGapMetaDataActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllCycleGapMetaDatasSaga() {
    // Watches for getCycleGapMetaDatas actions and calls getCycleGapMetaDatas when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(cycleGapMetaDataActions.getAllCycleGapMetaDatas.type, getAllCycleGapMetaDatas);
}

export default getAllCycleGapMetaDatasSaga;
