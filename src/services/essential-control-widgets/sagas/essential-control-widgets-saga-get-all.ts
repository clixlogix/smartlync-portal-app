import { /* take, */ call, put, select, takeLatest, all } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { essentialControlWidgetsActions } from 'services/essential-control-widgets/essential-control-widgets-reducer';
import { selectEssentialControlWidgetsFilters } from 'services/essential-control-widgets/essential-control-widgets-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllEssentialControlWidgetss() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(essentialControlWidgetsActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectEssentialControlWidgetsFilters);

        const { field } = params;
        const fieldColumnArray = field;

        if (!!token) {
            yield put(
                essentialControlWidgetsActions.error({
                    name: 'error',
                    message: 'cannot get data, not authenticated',
                    data: {},
                }),
            );
            return;
        }

        const options: any = fieldColumnArray.map((item) => ({
            url: Constant.essentialControlWidgetss,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params: { ...params, field: item },
        }));

        let result: any = {};
        for (let i = 0; i < options.length; i++) {
            try {
                result[options[i].params.field] = yield call(request, options[i]);
            } catch (err) {}
        }

        const AllResult = yield all(result);

        yield put(essentialControlWidgetsActions.setAllEssentialControlWidgetss({ AllResult }));
    } catch (err) {
        console.warn('getAllEssentialControlWidgetss.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                essentialControlWidgetsActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                essentialControlWidgetsActions.error({
                    name: 'error',
                    message: 'Getting essentialControlWidgetss failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(essentialControlWidgetsActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllEssentialControlWidgetssSaga() {
    // Watches for getEssentialControlWidgetss actions and calls getEssentialControlWidgetss when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(
        essentialControlWidgetsActions.getAllEssentialControlWidgetss.type,
        getAllEssentialControlWidgetss,
    );
}

export default getAllEssentialControlWidgetssSaga;
