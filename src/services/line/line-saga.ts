import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { linesActions } from './line-reducer';
import { selectLinesFilters } from './line-selectors';
import { selectAuthToken } from '../auth/auth-selectors';
import { Lines, Filters, FilterNames } from 'models';
import { getFilterParams } from 'utils';
import * as _ from 'lodash';
import moment from 'moment';

let filters: Filters = {
    lastUpdated: moment(),
};

/**
 *  repos request/response handler
 */
export function* getLines() {
    const paramNames: FilterNames[] = [FilterNames.systemType, FilterNames.plantId];

    try {
        // Call our request helper (see 'utils/request')
        yield put(linesActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const params: Filters = getFilterParams(paramNames, yield select(selectLinesFilters));
        console.log(`🚀 ~ function*getLines ~ params`, params);

        // const saveFilter = {
        //     ...params,
        // };

        // if (_.isEqual(saveFilter, filters)) {
        //     // return yield put(linesActions.loading(false));
        // }

        // filters = saveFilter;

        const options: any = {
            url: params.systemType === 'SWS' ? Constant.lines : Constant.linesSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const lines: Lines = yield call(request, options);

        yield put(linesActions.setLines(lines));
    } catch (err) {
        console.warn('getLines.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                linesActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                linesActions.error({ name: 'error', message: 'Getting lines failed', data: { status, message } }),
            );
        }
    }

    yield put(linesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* linesSaga() {
    // Watches for getLinesIds actions and calls getLinesIds when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(linesActions.lines.type, getLines);
}

export default linesSaga;
