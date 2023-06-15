import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { carbodyRiskActions } from 'services/carbody-risk/carbody-risk-reducer';
import { selectCarbodyRiskFilters } from 'services/carbody-risk/carbody-risk-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, CarbodyRisks, FilterNames } from 'models';
import { getFilterParams, getLineFromCarclass } from 'utils';
import moment from 'moment';

/**
 *  repos request/response handler
 */
export function* getAllCarbodyRisks() {
    const paramNames: FilterNames[] = [
        FilterNames.tenant,
        FilterNames.projectId,
        FilterNames.plantId,
        FilterNames.langCode,
        FilterNames.fromTime,
        FilterNames.toTime,
        FilterNames.deviceName,
        FilterNames.deviceLine,
        FilterNames.deviceSubLine,
        FilterNames.studId,
        FilterNames.carbodyId,
        FilterNames.weldId,
        FilterNames.systemType,
    ];

    try {
        // Call our request helper (see 'utils/request')
        yield put(carbodyRiskActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const { fromTime, toTime, ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectCarbodyRiskFilters)) }),
        );

        if (!!token) {
            yield put(
                carbodyRiskActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.carbodyRisks,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: {
                fromTime: moment(fromTime).format('YYYY-MM-DD HH:mm:ss'),
                toTime: moment(toTime).format('YYYY-MM-DD HH:mm:ss'),
                ...params,
            },
        };

        const carbodyRisks: CarbodyRisks = yield call(request, options);

        yield put(carbodyRiskActions.setAllCarbodyRisks(carbodyRisks));
    } catch (err: any) {
        console.warn('getAllCarbodyRisks.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                carbodyRiskActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                carbodyRiskActions.error({
                    name: 'error',
                    message: 'Getting carbodyRisks failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(carbodyRiskActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllCarbodyRisksSaga() {
    // Watches for getCarbodyRisks actions and calls getCarbodyRisks when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(carbodyRiskActions.getAllCarbodyRisks.type, getAllCarbodyRisks);
}

export default getAllCarbodyRisksSaga;
