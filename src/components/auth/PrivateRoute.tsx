import React, { useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoggedIn } from 'services/auth/auth-selectors';
import { isExpired } from 'react-jwt';
import { actions as authActions } from 'services/auth/auth-reducer';
import Constants from 'constants/index';

interface PrivateRouteProps extends RouteProps {
    children?: React.ReactNode;
    defaultPath?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, defaultPath = '/', ...rest }) => {
    const dispatch = useDispatch();
    const authenticated = useSelector(selectLoggedIn);
    const isTokenExpired = isExpired(localStorage.getItem(Constants.storageKeys.authToken) || '');
    useEffect(() => {
        dispatch(authActions.profile());
    }, [dispatch, authenticated, isTokenExpired]);

    return (
        <Route
            {...rest}
            render={({ location, ...props }) =>
                !isTokenExpired ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: defaultPath,
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
