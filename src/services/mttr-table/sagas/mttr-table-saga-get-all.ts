import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { mttrTableActions } from 'services/mttr-table/mttr-table-reducer';
import { selectMttrTableFilters, selectdefaultMttrTables } from 'services/mttr-table/mttr-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FilterNames, Filters, MttrTables } from 'models';
import { getFilterParams, getLineFromCarclass, getYearWeek } from 'utils';
import moment from 'moment';

/**
 *  repos request/response handler
 */
export function* getAllMttrTables() {
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
        yield put(mttrTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, systemFaults } = yield select(selectMttrTableFilters);

        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectMttrTableFilters)) }),
        );

        if (!!token) {
            yield put(
                mttrTableActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }
        // To-Do: Replace the parameter with the one that is used in API
        const fromWeek = moment(fromTime).clone().format('YYYYWW');
        const toWeek = moment(toTime).clone().format('YYYYWW');

        const options: any = {
            url: Constant.mttrTables,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromWeek, toWeek, fromTime, toTime },
        };
        if (!systemFaults) {
            const mttrTables: MttrTables = yield call(request, options);
            yield put(mttrTableActions.setAllMttrTables(mttrTables));
        }
        if (systemFaults) {
            yield put(mttrTableActions.setAllMttrTables(yield select(selectdefaultMttrTables)));
        }
    } catch (err: any) {
        console.warn('getAllMttrTables.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                mttrTableActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                mttrTableActions.error({
                    name: 'error',
                    message: 'Getting mttrTables failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(mttrTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMttrTablesSaga() {
    // Watches for getMttrTables actions and calls getMttrTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(mttrTableActions.getAllMttrTables.type, getAllMttrTables);
}

export default getAllMttrTablesSaga;
