import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { graphicDataActions } from 'services/graphic-data/graphic-data-reducer';
import { selectGraphicDataFilters } from 'services/graphic-data/graphic-data-selectors';
import { selectAuthToken } from 'services/auth/auth-selectors';
import { Filters, GraphicDatas } from 'models';

/**
 *  repos request/response handler
 */
export function* getAllGraphicDatas() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(graphicDataActions.loading(true));

        const { token } = yield select(selectAuthToken);
        const params: Filters = yield select(selectGraphicDataFilters);

        if (!!token) {
            yield put(
                graphicDataActions.error({ name: 'error', message: 'cannot get data, not authenticated', data: {} }),
            );
            return;
        }

        const options: any = {
            url: Constant.graphicDatas,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: token,
            },
            params,
        };

        const graphicDatas: GraphicDatas = yield call(request, options);

        yield put(graphicDataActions.setAllGraphicDatas(graphicDatas));
    } catch (err) {
        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                graphicDataActions.error({
                    name: 'error',
                    message: 'Authentication failed',
                    data: { status, message },
                }),
            );
        } else {
            yield put(
                graphicDataActions.error({
                    name: 'error',
                    message: 'Getting graphicDatas failed',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(graphicDataActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* getAllGraphicDatasSaga() {
    // Watches for getGraphicDatas actions and calls getGraphicDatas when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(graphicDataActions.getAllGraphicDatas.type, getAllGraphicDatas);
}

export default getAllGraphicDatasSaga;
