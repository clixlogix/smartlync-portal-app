import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { uptimeDistributionActions } from 'services/uptime-distribution/uptime-distribution-reducer';
import { selectUptimeDistributionFilters } from 'services/uptime-distribution/uptime-distribution-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, UptimeDistributions } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllUptimeDistributions() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(uptimeDistributionActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectUptimeDistributionFilters);

        if (!!token) {
            yield put(
                uptimeDistributionActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.uptimeDistributions,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };
        const uptimeDistributions: UptimeDistributions = yield call(request, options);

        yield put(uptimeDistributionActions.setAllUptimeDistributions(uptimeDistributions));
    } catch (err) {
        console.warn('getAllUptimeDistributions.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                uptimeDistributionActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                uptimeDistributionActions.error({
                    name: 'error',
                    message: 'Getting uptimeDistributions failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(uptimeDistributionActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllUptimeDistributionsSaga() {
    // Watches for getUptimeDistributions actions and calls getUptimeDistributions when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(uptimeDistributionActions.getAllUptimeDistributions.type, getAllUptimeDistributions);
}

export default getAllUptimeDistributionsSaga;
