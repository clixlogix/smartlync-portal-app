import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { mtbfAnalysisTableSprActions } from 'services/mtbf-analysis-table-spr/mtbf-analysis-table-spr-reducer';
import {
    selectMtbfAnalysisTableSprFilters,
    selectdefaultMtbfAnalysisTableSprs,
} from 'services/mtbf-analysis-table-spr/mtbf-analysis-table-spr-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FilterNames, Filters, MtbfAnalysisTableSprs } from 'models';
import { getFilterParams, getLineFromCarclass, getYearWeek } from 'utils';
import moment from 'moment';

/**
 *  repos request/response handler
 */
export function* getAllMtbfAnalysisTableSprs() {
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
        yield put(mtbfAnalysisTableSprActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, systemFaults } = yield select(selectMtbfAnalysisTableSprFilters);

        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectMtbfAnalysisTableSprFilters)) }),
        );

        if (!!token) {
            yield put(
                mtbfAnalysisTableSprActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const fromWeek = moment(fromTime).clone().format('YYYYWW');
        const toWeek = moment(toTime).clone().format('YYYYWW');

        const options: any = {
            url: Constant.mtbfAnalysisTableSprs,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromWeek, toWeek, fromTime, toTime },
        };

        if (!systemFaults) {
            const mtbfAnalysisTables: MtbfAnalysisTableSprs = yield call(request, options);
            yield put(mtbfAnalysisTableSprActions.setAllMtbfAnalysisTableSprs(mtbfAnalysisTables));
        }
        if (systemFaults) {
            yield put(
                mtbfAnalysisTableSprActions.setAllMtbfAnalysisTableSprs(
                    yield select(selectdefaultMtbfAnalysisTableSprs),
                ),
            );
        }
    } catch (err: any) {
        console.warn('getAllMtbfAnalysisTableSprs.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                mtbfAnalysisTableSprActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                mtbfAnalysisTableSprActions.error({
                    name: 'error',
                    message: 'Getting mtbfAnalysisTableSprs failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(mtbfAnalysisTableSprActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMtbfAnalysisTableSprsSaga() {
    // Watches for getMtbfAnalysisTableSprs actions and calls getMtbfAnalysisTableSprs when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(mtbfAnalysisTableSprActions.getAllMtbfAnalysisTableSprs.type, getAllMtbfAnalysisTableSprs);
}

export default getAllMtbfAnalysisTableSprsSaga;
