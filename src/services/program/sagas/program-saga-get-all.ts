import { /* take,  call,*/ put, select, takeLatest } from 'redux-saga/effects';
//import { request } from 'utils/request';
import Constant from 'constants/index';
import { programActions } from 'services/program/program-reducer';
import { selectProgramFilters } from 'services/program/program-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, Programs } from 'models';
import { programs as harcodedProgramData } from './data';

/**
 *  repos request/response handler
 */
export function* getAllPrograms() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(programActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectProgramFilters);

        if (!!token) {
            yield put(programActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }

        const options: any = {
            url: Constant.programs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        console.log('getAllPrograms.saga: getting programs with (token, options) ', token, options);

        //const programs: Programs = yield call(request, options);

        const programs: Programs = yield harcodedProgramData; // TODO: change this with actual API call

        console.log('getAllPrograms.saga: got results ( programs ) ', programs);

        yield put(programActions.setAllPrograms(programs));
    } catch (err) {
        console.warn('getAllPrograms.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                programActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                programActions.error({ name: 'error', message: 'Getting programs failed', data: { status, message } }),
            );
        }
    }

    yield put(programActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllProgramsSaga() {
    // Watches for getPrograms actions and calls getPrograms when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(programActions.getAllPrograms.type, getAllPrograms);
}

export default getAllProgramsSaga;
