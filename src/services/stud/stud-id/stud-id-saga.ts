import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { studIdsActions } from './stud-id-reducer';
import { selectStudIdsFilters } from './stud-id-selectors';
import { selectAuthToken } from './../../auth/auth-selectors';
import { StudIds, Filters, FilterNames } from 'models';
import { getFilterParams } from 'utils';
import * as _ from 'lodash';
import moment from 'moment';

let filters: Filters = {
    lastUpdated: moment(),
};

/**
 *  repos request/response handler
 */
export function* getStudIds() {
    const paramNames: FilterNames[] = [];

    try {
        // Call our request helper (see 'utils/request')
        yield put(studIdsActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const params: Filters = getFilterParams(paramNames, yield select(selectStudIdsFilters));

        const saveFilter = {
            ...params,
        };

        if (_.isEqual(saveFilter, filters)) {
            // return yield put(studIdsActions.loading(false));
        }

        filters = saveFilter;

        const options: any = {
            url: Constant.studIds,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const studIds: StudIds = yield call(request, options);

        yield put(studIdsActions.setStudIds(studIds));
    } catch (err) {
        console.warn('getStudIds.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                studIdsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                studIdsActions.error({ name: 'error', message: 'Getting studIds failed', data: { status, message } }),
            );
        }
    }

    yield put(studIdsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* studIdsSaga() {
    // Watches for getStudIds actions and calls getStudIds when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(studIdsActions.studIds.type, getStudIds);
}

export default studIdsSaga;
