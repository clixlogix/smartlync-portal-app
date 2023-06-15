import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { mtbfAnalysisTableActions } from 'services/mtbf-analysis-table/mtbf-analysis-table-reducer';
import {
    selectMtbfAnalysisTableFilters,
    selectdefaultMtbfAnalysisTables,
} from 'services/mtbf-analysis-table/mtbf-analysis-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FilterNames, Filters, MtbfAnalysisTables } from 'models';
import { getFilterParams, getLineFromCarclass, getYearWeek } from 'utils';
import moment from 'moment';

/**
 *  repos request/response handler
 */
export function* getAllMtbfAnalysisTables() {
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
        yield put(mtbfAnalysisTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, systemFaults } = yield select(selectMtbfAnalysisTableFilters);

        const { ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectMtbfAnalysisTableFilters)) }),
        );

        if (!!token) {
            yield put(
                mtbfAnalysisTableActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }
        // To-Do: Replace the parameter with the one that is used in API
        const fromWeek = moment(fromTime).clone().format('YYYYWW');
        const toWeek = moment(toTime).clone().format('YYYYWW');

        const options: any = {
            url: Constant.mtbfAnalysisTables,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromWeek, toWeek, fromTime, toTime },
        };

        if (!systemFaults) {
            const mtbfAnalysisTables: MtbfAnalysisTables = yield call(request, options);
            yield put(mtbfAnalysisTableActions.setAllMtbfAnalysisTables(mtbfAnalysisTables));
        }
        if (systemFaults) {
            yield put(mtbfAnalysisTableActions.setAllMtbfAnalysisTables(yield select(selectdefaultMtbfAnalysisTables)));
        }
    } catch (err: any) {
        console.warn('getAllMtbfAnalysisTables.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                mtbfAnalysisTableActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                mtbfAnalysisTableActions.error({
                    name: 'error',
                    message: 'Getting mtbfAnalysisTables failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(mtbfAnalysisTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMtbfAnalysisTablesSaga() {
    // Watches for getMtbfAnalysisTables actions and calls getMtbfAnalysisTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(mtbfAnalysisTableActions.getAllMtbfAnalysisTables.type, getAllMtbfAnalysisTables);
}

export default getAllMtbfAnalysisTablesSaga;
