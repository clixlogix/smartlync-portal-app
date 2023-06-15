import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface PublicRouteProps extends RouteProps {
    children: React.ReactNode;
    defaultPath?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, defaultPath = '/', ...rest }) => {
    return <Route {...rest} render={() => children} />;
};

export default PublicRoute;
