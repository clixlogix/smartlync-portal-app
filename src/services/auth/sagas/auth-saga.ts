import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { CustomError } from 'utils/error';
import { selectLogin } from 'services/auth/auth-selectors';
import { actions } from 'services/auth/auth-reducer';
import { AuthLogin } from 'models';
import { convertPropNameToLowerCamelcase } from 'utils';
import * as jwt from 'jsonwebtoken';

//const authToken = Constant.authToken;

/**
 * Auth repos request/response handler
 */
export function* getAuth() {
    yield put(actions.loading(false));

    // Select username from store
    const login: AuthLogin | any = yield select(selectLogin);

    if (login?.username?.length === 0) {
        yield put(actions.error(new CustomError({ name: 'error', message: 'Invalid username' })));
        return;
    }

    try {
        // Call our request helper (see 'utils/request')
        yield put(actions.loading(true));

        const options: any = {
            url: Constant.loginUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            data: { ...login, username: login.userName, more: false },
        };

        const auth: any = yield call(request, options);

        const secret = '0SecretKey!0';
        const authToken = jwt.verify(auth.jwtToken, secret);
        if (auth && authToken.userId && authToken.validAuthToken) {
            const data = Object.keys(authToken).reduce(
                (acc, key) => {
                    const newKey = convertPropNameToLowerCamelcase(key);
                    acc[newKey] = authToken[key];
                    return acc;
                },
                { token: authToken.result.token } as any,
            );

            const { token, ...user } = data;

            yield put(actions.auth({ id: user.userName, user, token, jwtToken: auth.jwtToken }));
        } else {
            yield put(actions.error({ message: 'Login failed', name: 'error' }));
        }
    } catch (err) {
        if (err.response?.status === 401) {
            yield put(actions.error({ message: 'Authentication failed', name: 'error' }));
        } else {
            yield put(actions.error({ message: 'Login failed', name: 'error' }));
        }
    }

    yield put(actions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* authSaga() {
    // Watches for authLogin actions and calls getAuth when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(actions.authLogin.type, getAuth);
}
