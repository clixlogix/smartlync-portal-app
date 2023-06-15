import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { studTypesActions } from './stud-type-reducer';
import { selectStudTypesFilters } from './stud-type-selectors';
import { selectAuthToken } from './../../auth/auth-selectors';
import { StudTypes, FilterNames, Filters } from 'models';
import { getFilterParams } from 'utils';
import moment from 'moment';

let filters: Filters = {
    lastUpdated: moment(),
};

/**
 *  repos request/response handler
 */
export function* getStudTypes() {
    const paramNames: FilterNames[] = [];

    try {
        // Call our request helper (see 'utils/request')
        yield put(studTypesActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const params: Filters = getFilterParams(paramNames, yield select(selectStudTypesFilters));

        const saveFilter = {
            ...params,
        };

        if (_.isEqual(saveFilter, filters)) {
            // return yield put(studTypesActions.loading(false));
        }

        filters = saveFilter;

        const options: any = {
            url: Constant.studTypes,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const studTypes: StudTypes = yield call(request, options);

        yield put(studTypesActions.setStudTypes(studTypes));
    } catch (err) {
        console.warn('getStudTypes.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                studTypesActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                studTypesActions.error({
                    name: 'error',
                    message: 'Getting studTypes failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(studTypesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* studTypesSaga() {
    // Watches for getStudTypes actions and calls getStudTypes when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(studTypesActions.studTypes.type, getStudTypes);
}

export default studTypesSaga;
