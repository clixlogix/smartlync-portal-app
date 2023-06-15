import { /* take, */ call, put, select, takeLatest } from 'redux-saga/effects';
import * as jwt from 'jsonwebtoken';
import { request } from 'utils/request';
import Constant from 'constants/index';
import { loginActions } from 'services/login/login-reducer';
import { selectLoginFilters } from 'services/login/login-selectors';
import { CustomError } from 'utils/error';
import { actions as authAction } from 'services/auth/auth-reducer';
import { AuthLogin } from 'models';
import { convertPropNameToLowerCamelcase } from 'utils';

/**
 *  repos request/response handler
 */
export function* authLogin() {
    try {
        // Call our request helper (see 'utils/request')
        yield put(loginActions.loading(true));

        // Select username from store
        const login: AuthLogin | any = yield select(selectLoginFilters);

        if (!login.username) {
            // @ts-ignore
            const { authUser } = window;

            login.userName = authUser.userName;
            login.password = authUser.password;
        }

        if (login?.username?.length === 0) {
            yield put(loginActions.error(new CustomError({ name: 'error', message: 'Invalid username' })));
            return;
        }

        const options: any = {
            url: Constant.loginUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            data: login,
        };

        const auth: any = yield call(request, options);
        // TODO : this should not be pushed to repository
        const secret = '0SecretKey!0';
        const authToken = jwt.verify(auth.jwtToken, secret);
        if (auth && authToken.userId) {
            const data = Object.keys(authToken).reduce(
                (acc, key) => {
                    const newKey = convertPropNameToLowerCamelcase(key);
                    acc[newKey] = authToken[key];
                    return acc;
                },
                { token: authToken.result.token } as any,
            );

            const { token, ...user } = data;

            yield put(authAction.auth({ id: user.userName, user, token, jwtToken: auth.jwtToken }));
        } else {
            yield put(loginActions.error({ message: 'Login failed', name: 'error' }));
        }
    } catch (err) {
        console.warn('postLogin.saga.ERROR: got error (err) ', err);

        const { status = 0, message = '' } = { ...err.response };

        if (status === 401) {
            yield put(
                loginActions.error({ name: 'error', message: 'Authentication failed', data: { status, message } }),
            );
        } else {
            yield put(
                loginActions.error({
                    name: 'error',
                    message: 'Login failed.\n Invalid username or password',
                    data: { status, message },
                }),
            );
        }
    }

    yield put(loginActions.loading(false));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* loginSaga() {
    // Watches for getLogins actions and calls getLogins when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(loginActions.login.type, authLogin);
}

export default loginSaga;
