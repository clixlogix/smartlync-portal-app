import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultCodesActions } from './fault-code-reducer';
import { selectFaultCodesFilters } from './fault-code-selectors';
import { selectAuthToken } from './../../auth/auth-selectors';
import { /* FaultCodes, */ FilterNames, Filters, eventType, eventTypeGerman } from 'models';
import * as _ from 'lodash';
import { getFilterParams } from 'utils';
import moment from 'moment';

let filters: Filters = {
    lastUpdated: moment(),
};

/**
 *  repos request/response handler
 */
export function* getFaultCodes() {
    const paramNames: FilterNames[] = [FilterNames.eventType, FilterNames.systemType, FilterNames.plantId];

    try {
        // Call our request helper (see 'utils/request')
        yield put(faultCodesActions.loading(true));

        const { token } = yield select(selectAuthToken);

        let params: Filters = getFilterParams(paramNames, yield select(selectFaultCodesFilters));
        if (params.eventType === eventType.Fault || params.eventType === eventTypeGerman.Fault) {
            params.eventType = 0;
        }
        // const saveFilter = {
        //     ...params,
        // };

        // if (_.isEqual(saveFilter, filters)) {
        //     // return yield put(faultCodesActions.loading(false));
        // }

        // filters = saveFilter;

        const options: any = {
            url: params.systemType === 'SWS' ? Constant.faultCodes : Constant.faultCodesSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const faultCodes: any /* FaultCodes */ = yield call(request, options);

        yield put(faultCodesActions.setFaultCodes(faultCodes));
    } catch (err: any) {
        console.warn('getFaultCodes.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultCodesActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                faultCodesActions.error({
                    name: 'error',
                    message: 'Getting faultCodes failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultCodesActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* faultCodesSaga() {
    // Watches for getFaultCodes actions and calls getFaultCodes when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(faultCodesActions.faultCodes.type, getFaultCodes);
}

export default faultCodesSaga;
