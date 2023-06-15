import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { request } from 'utils/request';
import { selectLoggedInUserDetails } from '../auth-selectors';
import { actions } from '../auth-reducer';
import { User } from 'models';
import Constant from 'constants/index';

/**
 * Auth repos request/response handler
 */
export function* getProfile() {
    yield put(actions.loading(false));
    yield delay(1000);

    // Select username from store
    const user: User = yield select(selectLoggedInUserDetails);

    try {
        // Call our request helper (see 'utils/request')
        yield put(actions.loading(true));

        const options: any = {
            url: `${Constant.profileUrl}/${user.email}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            params: {},
        };

        const data: any = yield call(request, options);
        const userProfile = { ...user, ...data };

        yield put(actions.setProfile(userProfile));
    } catch (err) {
        if (err.response?.status === 401) {
            yield put(actions.error({ message: 'Authentication failed', name: 'error' }));
            yield put(actions.logout());
        } else {
            yield put(actions.error({ message: 'Getting profile failed', name: 'error' }));
            yield put(actions.logout());
        }
    }

    yield put(actions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* authProfileSaga() {
    // Watches for profile actions and calls getAuth when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(actions.profile.type, getProfile);
}
