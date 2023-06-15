import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { userManagementWidgetActions } from 'services/user-management-widget/user-management-widget-reducer';
import { selectUserManagementWidgetFilters } from 'services/user-management-widget/user-management-widget-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, UserManagementWidgets } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllUserManagementWidgets() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(userManagementWidgetActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectUserManagementWidgetFilters);

        if (!!token) {
            yield put(
                userManagementWidgetActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.userManagementWidgets,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        console.log(
            'getAllUserManagementWidgets.saga: getting userManagementWidgets with (token, options) ',
            token,
            options,
        );

        const userManagementWidgets: UserManagementWidgets = yield call(request, options);

        console.log('getAllUserManagementWidgets.saga: got results ( userManagementWidgets ) ', userManagementWidgets);

        yield put(userManagementWidgetActions.setAllUserManagementWidgets(userManagementWidgets));
    } catch (err) {
        console.warn('getAllUserManagementWidgets.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                userManagementWidgetActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                userManagementWidgetActions.error({
                    name: 'error',
                    message: 'Getting userManagementWidgets failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(userManagementWidgetActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllUserManagementWidgetsSaga() {
    // Watches for getUserManagementWidgets actions and calls getUserManagementWidgets when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(userManagementWidgetActions.getAllUserManagementWidgets.type, getAllUserManagementWidgets);
}

export default getAllUserManagementWidgetsSaga;
