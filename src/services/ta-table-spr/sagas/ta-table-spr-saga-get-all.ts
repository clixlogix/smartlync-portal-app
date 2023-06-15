import Constant from 'constants/index';
import { FilterNames, Filters, TaTableSprs } from 'models';
import moment from 'moment';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { taTableSprActions } from 'services/ta-table-spr/ta-table-spr-reducer';
import { selectdefaultTaTables, selectTaTableSprFilters } from 'services/ta-table-spr/ta-table-spr-selectors';
import { getFilterParams, getLineFromCarclass, getYearWeek } from 'utils';
import { request } from 'utils/request';

/**
 *  repos request/response handler
 */
export function* getAllTaTableSprs() {
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
        yield put(taTableSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, systemFaults } = yield select(selectTaTableSprFilters);

        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectTaTableSprFilters)) }),
        );

        if (!!token) {
            yield put(
                taTableSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const fromWeek = moment(fromTime).clone().format('YYYYWW');
        const toWeek = moment(toTime).clone().format('YYYYWW');

        const options: any = {
            url: Constant.taTableSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromWeek, toWeek, fromTime, toTime },
        };

        if (!systemFaults) {
            const taTables: TaTableSprs = yield call(request, options);
            yield put(taTableSprActions.setAllTaTableSprs(taTables));
        }

        if (systemFaults) {
            yield put(taTableSprActions.setAllTaTableSprs(yield select(selectdefaultTaTables)));
        }
    } catch (err: any) {
        console.warn('getAllTaTableSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                taTableSprActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                taTableSprActions.error({
                    name: 'error',
                    message: 'Getting taTableSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(taTableSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTaTableSprsSaga() {
    // Watches for getTaTableSprs actions and calls getTaTableSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(taTableSprActions.getAllTaTableSprs.type, getAllTaTableSprs);
}

export default getAllTaTableSprsSaga;
