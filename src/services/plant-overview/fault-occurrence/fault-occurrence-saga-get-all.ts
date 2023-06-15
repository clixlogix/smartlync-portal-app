import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultOccurrencesActions } from 'services/plant-overview/fault-occurrence/fault-occurrence-reducer';
import { selectFaultOccurrencesFilters } from 'services/plant-overview/fault-occurrence/fault-occurrence-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, FaultOccurrences } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllFaultOccurrences() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(faultOccurrencesActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectFaultOccurrencesFilters);

        params = getLineFromCarclass(params);
        if (!!token) {
            yield put(
                faultOccurrencesActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.faultOccurrences,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const faultOccurrences: FaultOccurrences = yield call(request, options);

        yield put(faultOccurrencesActions.setAllFaultOccurrences(faultOccurrences));
    } catch (err: any) {
        console.warn('getAllFaultOccurrences.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultOccurrencesActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                faultOccurrencesActions.error({
                    name: 'error',
                    message: 'Getting faultOccurrences failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultOccurrencesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllFaultOccurrencesSaga() {
    // Watches for getFaultOccurrences actions and calls getFaultOccurrences when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(faultOccurrencesActions.getAllFaultOccurrences.type, getAllFaultOccurrences);
}

export default getAllFaultOccurrencesSaga;
