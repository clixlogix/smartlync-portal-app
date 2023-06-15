import { /* take, */ call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { cycleGapMetaDataSprActions } from 'services/cycle-gap-meta-data-spr/cycle-gap-meta-data-spr-reducer';
import { selectCycleGapMetaDataSprFilters } from 'services/cycle-gap-meta-data-spr/cycle-gap-meta-data-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CycleGapMetaDataSprs } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllCycleGapMetaDataSprs() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(cycleGapMetaDataSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectCycleGapMetaDataSprFilters);

        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                cycleGapMetaDataSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        // const options: any = {
        //     url: Constant.cycleGapMetaDataSprs,
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8',
        //         Authorization: token,
        //     },
        //     params,
        // };

        const options: any = {
            url: Constant.cycleGapMetaDataSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const options1: any = {
            url: Constant.cycleGapMetaDataSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, graphData: true },
        };

        const cycleGapMetaDataSprs: CycleGapMetaDataSprs = yield all({
            metaData: call(request, options),
            graphData: call(request, options1),
        });

        yield put(cycleGapMetaDataSprActions.setAllCycleGapMetaDataSprs(cycleGapMetaDataSprs));
    } catch (err) {
        console.warn('getAllCycleGapMetaDataSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                cycleGapMetaDataSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                cycleGapMetaDataSprActions.error({
                    name: 'error',
                    message: 'Getting cycleGapMetaDataSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(cycleGapMetaDataSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllCycleGapMetaDataSprsSaga() {
    // Watches for getCycleGapMetaDataSprs actions and calls getCycleGapMetaDataSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(cycleGapMetaDataSprActions.getAllCycleGapMetaDataSprs.type, getAllCycleGapMetaDataSprs);
}

export default getAllCycleGapMetaDataSprsSaga;
