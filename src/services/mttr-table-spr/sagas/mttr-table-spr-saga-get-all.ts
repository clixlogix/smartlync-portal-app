import Constant from 'constants/index';
import { FilterNames, Filters, MttrTableSprs } from 'models';
import moment from 'moment';
import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { mttrTableSprActions } from 'services/mttr-table-spr/mttr-table-spr-reducer';
import {
    selectdefaultMttrTableSprs,
    selectMttrTableSprFilters,
} from 'services/mttr-table-spr/mttr-table-spr-selectors';
import { getFilterParams, getLineFromCarclass, getYearWeek } from 'utils';
import { request } from 'utils/request';

/**
 *  repos request/response handler
 */
export function* getAllMttrTableSprs() {
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
        yield put(mttrTableSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, systemFaults }: Filters = yield select(selectMttrTableSprFilters);

        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectMttrTableSprFilters)) }),
        );

        if (!!token) {
            yield put(
                mttrTableSprActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        // To-Do: Replace the parameter with the one that is used in API
        const fromWeek = moment(fromTime).clone().format('YYYYWW');
        const toWeek = moment(toTime).clone().format('YYYYWW');

        const options: any = {
            url: Constant.mttrTableSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromWeek, toWeek, fromTime, toTime },
        };

        const mttrTableSprs: MttrTableSprs = yield call(request, options);

        if (!systemFaults) {
            const mttrTables: MttrTableSprs = yield call(request, options);
            yield put(mttrTableSprActions.setAllMttrTableSprs(mttrTables));
        }
        if (systemFaults) {
            yield put(mttrTableSprActions.setAllMttrTableSprs(yield select(selectdefaultMttrTableSprs)));
        }

        yield put(mttrTableSprActions.setAllMttrTableSprs(mttrTableSprs));
    } catch (err: any) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                mttrTableSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                mttrTableSprActions.error({
                    name: 'error',
                    message: 'Getting mttrTableSors failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(mttrTableSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMttrTableSprsSaga() {
    // Watches for getMttrTableSors actions and calls getMttrTableSors when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(mttrTableSprActions.getAllMttrTableSprs.type, getAllMttrTableSprs);
}

export default getAllMttrTableSprsSaga;
