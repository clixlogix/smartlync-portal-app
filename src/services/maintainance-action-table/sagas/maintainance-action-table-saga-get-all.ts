import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { maintainanceActionTableActions } from 'services/maintainance-action-table/maintainance-action-table-reducer';
import { selectMaintainanceActionTableFilters } from 'services/maintainance-action-table/maintainance-action-table-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, MaintainanceActionTables } from 'models';
import { getLineFromCarclass } from 'utils';

/**
 *  repos request/response handler
 */
export function* getAllMaintainanceActionTables() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(maintainanceActionTableActions.loading(true));

        const { token } = yield select(selectAuthToken);
        let params: Filters = yield select(selectMaintainanceActionTableFilters);
        params = getLineFromCarclass(params);

        if (!!token) {
            yield put(
                maintainanceActionTableActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = {
            url: Constant.maintainanceActionTables,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const maintainanceActionTables: MaintainanceActionTables = yield call(request, options);

        yield put(maintainanceActionTableActions.setAllMaintainanceActionTables(maintainanceActionTables));
    } catch (err: any) {
        console.warn('getAllMaintainanceActionTables.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                maintainanceActionTableActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                maintainanceActionTableActions.error({
                    name: 'error',
                    message: 'Getting maintainanceActionTables failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(maintainanceActionTableActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllMaintainanceActionTablesSaga() {
    // Watches for getMaintainanceActionTables actions and calls getMaintainanceActionTables when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        maintainanceActionTableActions.getAllMaintainanceActionTables.type,
        getAllMaintainanceActionTables,
    );
}

export default getAllMaintainanceActionTablesSaga;
