import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { systemOverviewsActions } from './system-overview-reducer';
import { selectSystemOverviewsFilters } from './system-overview-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { FilterNames, Filters, SystemOverviews } from 'models';
import { getFilterParams, getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getSystemOverviews() {
    const paramNames: FilterNames[] = [
        FilterNames.langCode,
        FilterNames.fromTime,
        FilterNames.toTime,
        FilterNames.plantId,
        FilterNames.systemType,
        FilterNames.deviceName,
        FilterNames.deviceLine,
        FilterNames.deviceSubLine,
        FilterNames.station,
    ];

    try {
        // Call our request helper (see 'utils/request')
        yield put(systemOverviewsActions.loading(true));

        const { token } = yield select(selectAuthToken);

        const { fromTime, toTime, deviceName, ...params }: Filters = getFilterParams(
            paramNames,
            getLineFromCarclass({ ...(yield select(selectSystemOverviewsFilters)) }),
        );
        if (!!token) {
            yield put(
                systemOverviewsActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: params.systemType === 'SWS' ? Constant.systemOverviews : Constant.systemOverviewSpr,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, fromTime, toTime, deviceName },
        };

        const systemOverviews: SystemOverviews = yield call(request, options);

        yield put(systemOverviewsActions.setSystemOverviews(systemOverviews));
    } catch (err: any) {
        console.warn('getSystemOverviews.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                systemOverviewsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                systemOverviewsActions.error({
                    name: 'error',
                    message: 'Getting systemOverviews failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(systemOverviewsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* systemOverviewsSaga() {
    // Watches for getSystemOverviews actions and calls getSystemOverviews when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(systemOverviewsActions.systemOverviews.type, getSystemOverviews);
}

export default systemOverviewsSaga;
