import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { uploadStatActions } from 'services/upload-stat/upload-stat-reducer';
import { selectUploadListItemFilters } from 'services/upload-stat/upload-stat-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, UploadListItems, FilterNames } from 'models';
import { getFilterParams } from 'utils/index';
import moment from 'moment';
import * as _ from 'lodash';

let filters = {};

/**
 *  repos request/response handler
 */
export function* getAllUploadListItems() {
    const paramNames: FilterNames[] = [
        FilterNames.plantId,
        FilterNames.tenant,
        FilterNames.langCode,
        FilterNames.fromTime,
        FilterNames.toTime,
        FilterNames.faultCode,
        FilterNames.view,
    ];

    try {
        // Call our request helper (see 'utils/request')
        yield put(uploadStatActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const { fromTime, toTime, view, ...params }: Filters = getFilterParams(
            paramNames,
            yield select(selectUploadListItemFilters),
        );

        const saveFilter = {
            ...params,
            [FilterNames.fromTime]: moment(fromTime).format('YYY-MM-DDTHH:00:00Z'),
            [FilterNames.toTime]: moment(toTime).format('YYY-MM-DDTHH:00:00Z'),
        };

        if (_.isEqual(saveFilter, filters)) {
            return yield put(uploadStatActions.loading(false));
        }

        filters = saveFilter;

        if (!!token) {
            yield put(
                uploadStatActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.uploadListItems,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const uploadListItems: UploadListItems = yield call(request, options);

        yield put(uploadStatActions.setAllUploadListItems(uploadListItems));
    } catch (err) {
        console.warn('getAllUploadListItems.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                uploadStatActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                uploadStatActions.error({
                    name: 'error',
                    message: 'Getting UploadListItems failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(uploadStatActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllUploadListItemsSaga() {
    // Watches for getUploadListItems actions and calls getUploadListItems when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(uploadStatActions.getAllUploadListItems.type, getAllUploadListItems);
}

export default getAllUploadListItemsSaga;
