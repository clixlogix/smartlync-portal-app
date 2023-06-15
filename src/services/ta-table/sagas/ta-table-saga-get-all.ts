import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { taTableActions } from 'services/ta-table/ta-table-reducer';
import { selectTaTableFilters, selectdefaultTaTables } from 'services/ta-table/ta-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FilterNames, Filters, TaTables } from 'models';
import { getFilterParams, getLineFromCarclass, getYearWeek } from 'utils';
import moment from 'moment';

/**
 *  repos request/response handler
 */
export function* getAllTaTables() {
    const paramNames: FilterNames[] = [
        // FilterNames.fromTime,
        // FilterNames.toTime,
        FilterNames.deviceName,
        FilterNames.langCode,
        FilterNames.plantId,
        FilterNames.deviceLine,
        FilterNames.deviceSubLine,
        FilterNames.station,
        FilterNames.groupBy,
        FilterNames.headType,
        FilterNames.systemType,
    ];

    try {
        // Call our request helper (see 'utils/request')
        yield put(taTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, systemFaults } = yield select(selectTaTableFilters);

        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectTaTableFilters)) }),
        );

        if (!!token) {
            yield put(taTableActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }));
            return;
        }
        // To-Do: Replace the parameter with the one that is used in API
        const fromWeek = moment(fromTime).clone().format('YYYYWW');
        const toWeek = moment(toTime).clone().format('YYYYWW');

        const options: any = {
            url: Constant.taTables,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromWeek, toWeek, fromTime, toTime },
        };
        if (!systemFaults) {
            const taTables: TaTables = yield call(request, options);
            yield put(taTableActions.setAllTaTables(taTables));
        }
        if (systemFaults) {
            yield put(taTableActions.setAllTaTables(yield select(selectdefaultTaTables)));
        }
    } catch (err: any) {
        console.warn('getAllTaTables.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                taTableActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                taTableActions.error({ name: 'error', message: 'Getting taTables failed', data: { status, message } }),
            );
        }
    }

    yield put(taTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTaTablesSaga() {
    // Watches for getTaTables actions and calls getTaTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(taTableActions.getAllTaTables.type, getAllTaTables);
}

export default getAllTaTablesSaga;
