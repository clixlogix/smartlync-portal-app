import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { ttrTableActions } from 'services/ttr-table/ttr-table-reducer';
import { selectTtrTableFilters, selectdefaultTtrTables } from 'services/ttr-table/ttr-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FilterNames, Filters, TtrTables } from 'models';
import { getFilterParams, getLineFromCarclass, getYearWeek } from 'utils';
import moment from 'moment';

/**
 *  repos request/response handler
 */
export function* getAllTtrTables() {
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
        yield put(ttrTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, systemFaults } = yield select(selectTtrTableFilters);

        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectTtrTableFilters)) }),
        );

        if (!!token) {
            yield put(
                ttrTableActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }
        // To-Do: Replace the parameter with the one that is used in API
        const fromWeek = moment(fromTime).clone().format('YYYYWW');
        const toWeek = moment(toTime).clone().format('YYYYWW');

        const options: any = {
            url: Constant.ttrTables,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromWeek, toWeek, fromTime, toTime },
        };
        if (!systemFaults) {
            const ttrTables: TtrTables = yield call(request, options);
            yield put(ttrTableActions.setAllTtrTables(ttrTables));
        }
        if (systemFaults) {
            yield put(ttrTableActions.setAllTtrTables(yield select(selectdefaultTtrTables)));
        }
    } catch (err: any) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                ttrTableActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                ttrTableActions.error({
                    name: 'error',
                    message: 'Getting mttrTables failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(ttrTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTtrTablesSaga() {
    // Watches for getTtrTables actions and calls getTtrTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(ttrTableActions.getAllTtrTables.type, getAllTtrTables);
}

export default getAllTtrTablesSaga;
