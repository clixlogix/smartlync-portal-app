// import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
// import { request } from 'utils/request';
// import Constant from 'constants/index';
// import { taAnalysisTableSprActions } from 'services/ta-analysis-table-spr/ta-analysis-table-spr-reducer';
// import { selectTaAnalysisTableSprFilters } from 'services/ta-analysis-table-spr/ta-analysis-table-spr-selectors';
// import { selectAuthToken } from 'services/auth/auth-selectors';
// import { Filters, TaAnalysisTableSprs } from 'models';

// /**
//  *  repos request/response handler
//  */
// export function* getAllTaAnalysisTableSprs() {
//     try {
//         // Call our request helper (see 'utils/request')
//         yield put(taAnalysisTableSprActions.loading(true));

//         const { token } = yield select(selectAuthToken);
//         const params: Filters = yield select(selectTaAnalysisTableSprFilters);

//         if (!!token) {
//             yield put(
//                 taAnalysisTableSprActions.error({
//                     name: 'error',
//                     message: 'cannot get data, not authenticated',
//                     data: {},
//                 }),
//             );
//             return;
//         }

//         const options: any = {
//             url: Constant.taAnalysisTableSprs,
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json;charset=utf-8',
//                 Authorization: token,
//             },
//             params,
//         };

//         console.log(
//             'getAllTaAnalysisTableSprs.saga: getting taAnalysisTableSprs with (token, options) ',
//             token,
//             options,
//         );

//         const taAnalysisTableSprs: TaAnalysisTableSprs = yield call(request, options);

//         console.log('getAllTaAnalysisTableSprs.saga: got results ( taAnalysisTableSprs ) ', taAnalysisTableSprs);

//         yield put(taAnalysisTableSprActions.setAllTaAnalysisTableSprs(taAnalysisTableSprs));
//     } catch (err) {
//         console.warn('getAllTaAnalysisTableSprs.saga.ERROR: got error (err) ', err);

//         const { status = 0, message = '' } = { ...err.response };

//         if (status === 401) {
//             yield put(
//                 taAnalysisTableSprActions.error({
//                     name: 'error',
//                     message: 'Authentication failed',
//                     data: { status, message },
//                 }),
//             );
//         } else {
//             yield put(
//                 taAnalysisTableSprActions.error({
//                     name: 'error',
//                     message: 'Getting taAnalysisTableSprs failed',
//                     data: { status, message },
//                 }),
//             );
//         }
//     }

//     yield put(taAnalysisTableSprActions.loading(false));
// }

// /**
//  * Root saga manages watcher lifecycle
//  */
// export function* getAllTaAnalysisTableSprsSaga() {
//     // Watches for getTaAnalysisTableSprs actions and calls getTaAnalysisTableSprs when one comes in.
//     // By using `takeLatest` only the result of the latest API call is applied.
//     // It returns task descriptor (just like fork) so we can continue execution
//     // It will be cancelled automatically on component unmount
//     yield takeLatest(taAnalysisTableSprActions.getAllTaAnalysisTableSprs.type, getAllTaAnalysisTableSprs);
// }

// export default getAllTaAnalysisTableSprsSaga;
