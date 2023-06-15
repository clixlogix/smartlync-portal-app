import Constant from 'constants/index';
import { FilterNames, Filters, TtrTableSprs } from 'models';
import moment from 'moment';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { selectdefaultMttrTableSprs } from 'services/mttr-table-spr/mttr-table-spr-selectors';
import { ttrTableSprActions } from 'services/ttr-table-spr/ttr-table-spr-reducer';
import { selectTtrTableSprFilters } from 'services/ttr-table-spr/ttr-table-spr-selectors';
import { getFilterParams, getLineFromCarclass, getYearWeek } from 'utils';
import { request } from 'utils/request';

/**
 *  repos request/response handler
 */
export function* getAllTtrTableSprs() {
    const paramNames: FilterNames[] = [
        FilterNames.fromTime,
        FilterNames.toTime,
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
        yield put(ttrTableSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { weekRange, systemFaults } = yield select(selectTtrTableSprFilters);
        const { fromWeek, toWeek } = getYearWeek(weekRange);
        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectTtrTableSprFilters)) }),
        );

        if (!!token) {
            yield put(
                ttrTableSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }
        const fromTime = moment(fromWeek, 'YYYYWW').clone().startOf('isoWeek');
        const toTime = moment(toWeek, 'YYYYWW').clone().endOf('isoWeek');

        const options: any = {
            url: Constant.ttrTableSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromWeek, toWeek, fromTime, toTime },
        };

        if (!systemFaults) {
            const ttrTables: TtrTableSprs = yield call(request, options);
            yield put(ttrTableSprActions.setAllTtrTableSprs(ttrTables));
        }

        if (systemFaults) {
            yield put(ttrTableSprActions.setAllTtrTableSprs(yield select(selectdefaultMttrTableSprs)));
        }
    } catch (err: any) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                ttrTableSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                ttrTableSprActions.error({
                    name: 'error',
                    message: 'Getting ttrTableSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(ttrTableSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllTtrTableSprsSaga() {
    // Watches for getTtrTableSprs actions and calls getTtrTableSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(ttrTableSprActions.getAllTtrTableSprs.type, getAllTtrTableSprs);
}

export default getAllTtrTableSprsSaga;
