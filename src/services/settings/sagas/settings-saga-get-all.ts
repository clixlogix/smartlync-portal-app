import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { settingsActions } from 'services/settings/settings-reducer';
import { selectSettingsFilters } from 'services/settings/settings-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, Settingss } from 'models';
import moment from 'moment';

/**
 *  repos request/response handler
 */
export function* getAllSettingss() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(settingsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectSettingsFilters);

        if (!!token) {
            yield put(
                settingsActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.settingss,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const settingss: Settingss = yield call(request, options);

        yield put(settingsActions.setAllSettingss(settingss));
    } catch (err: any) {
        console.warn('getAllSettingss.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                settingsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                settingsActions.error({
                    name: 'error',
                    message: 'Getting settingss failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(settingsActions.loading(false));
}

function* setOperation({ payload: operation }) {
    try {
        // const settingss: Settingss = yield call(request, options);
        // yield put(settingsActions.setAllSettingss(settingss));

        yield put(settingsActions.setAllSettingss(operation));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                settingsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                settingsActions.error({
                    name: 'error',
                    message: 'Getting settingss failed',
                    data: { status, message },
                }),
            );
        }
    }
}

function* editOperation({ payload: operation }) {
    try {
        // const settingss: Settingss = yield call(request, options);
        // yield put(settingsActions.setAllSettingss(settingss));

        const formattedOperation = {
            ...operation,
            startTime: moment(operation.from).toDate(),
            endTime: moment(operation.to).toDate(),
            startDate: moment(operation.from).toDate(),
            endDate: moment(operation.to).toDate(),
        };

        delete formattedOperation.from;
        delete formattedOperation.to;

        yield put(settingsActions.setEditedSettings(formattedOperation));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                settingsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                settingsActions.error({
                    name: 'error',
                    message: 'Getting settingss failed',
                    data: { status, message },
                }),
            );
        }
    }
}

function* deleteOperation({ payload: operation }) {
    try {
        // const settingss: Settingss = yield call(request, options);
        // yield put(settingsActions.setAllSettingss(settingss));
        // yield put(settingsActions.setAllSettingss(operation));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                settingsActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                settingsActions.error({
                    name: 'error',
                    message: 'Getting settingss failed',
                    data: { status, message },
                }),
            );
        }
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllSettingssSaga() {
    // Watches for getSettingss actions and calls getSettingss when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(settingsActions.getAllSettingss.type, getAllSettingss);
    yield takeLatest(settingsActions.setOperation, setOperation);
    yield takeLatest(settingsActions.editOperation, editOperation);
    yield takeLatest(settingsActions.deleteOperation, deleteOperation);
}

export default getAllSettingssSaga;
