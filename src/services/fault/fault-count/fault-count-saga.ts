import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { faultCountsActions } from './fault-count-reducer';
import { selectFaultCountsFilters } from './fault-count-selectors';
import { selectAuthToken } from '../../auth/auth-selectors';
import { FaultCounts, FilterNames, Filters } from 'models';
import { getFilterParams, getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
// const { t, i18n } = useTranslation();
export function* getFaultCounts() {
    const paramNames: FilterNames[] = [
        FilterNames.deviceName,
        FilterNames.faultAssignment,
        FilterNames.eventType,
        FilterNames.eventTypeCode,
        FilterNames.langCode,
        FilterNames.fromTime,
        FilterNames.toTime,
        FilterNames.plantId,
        FilterNames.weekDay,
        FilterNames.view,
        FilterNames.studType,
        FilterNames.deviceLine,
        FilterNames.deviceSubLine,
        FilterNames.eventCode,
        FilterNames.systemType,
    ];

    try {
        // Call our request helper (see 'utils/request')
        yield put(faultCountsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, faultCode, eventTypeCode, eventCode, ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectFaultCountsFilters)) }),
        );

        const options: any = {
            url: Constant.faultCounts,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            // TODO: send faultCode as an array
            params: { fromTime, toTime, ...params, eventCode, eventType: eventTypeCode },
        };

        const faultCounts: FaultCounts = yield call(request, options);

        yield put(faultCountsActions.setFaultCounts(faultCounts));
    } catch (err: any) {
        console.warn('getFaultCounts.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                faultCountsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                faultCountsActions.error({
                    name: 'error',
                    message: 'Getting faultCounts failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(faultCountsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* faultCountsSaga() {
    // Watches for getFaultRates actions and calls getFaultRates when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(faultCountsActions.faultCounts.type, getFaultCounts);
}

export default faultCountsSaga;
