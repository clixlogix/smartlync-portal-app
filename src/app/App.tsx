/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { actions as authActions, auth as authKey, reducer as authReducer } from 'services/auth/auth-reducer';
import { selectLoggedIn, selectLoggedInUserDetails } from 'services/auth/auth-selectors';
import { authProfileSaga } from 'services/auth/sagas';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LicenseInfo } from '@mui/x-license-pro';

import { PublicRoute } from 'components/auth/PublicRoute';
import moment from 'moment';
import 'moment-timezone';
import { NotFoundPage } from 'pages/NotFoundPage';
import { SignIn } from 'pages/SignIn';
// import { registerLocale } from 'react-datepicker';
import AppRoutes from './AppRoutes';
import { UserManagement } from 'pages/UserManagement/Loadable';
// [INSERT NEW PAGE IMPORT ABOVE]  Needed for generating pages seamlessly

import { selectTheme } from 'styles/theme/slice';
import './App.scss';
import ForgetPass from 'pages/forgetPassword/forgetPassword';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENSE_KEY);

export function App() {
    useInjectReducer({ key: authKey, reducer: authReducer });
    useInjectSaga({ key: authKey, saga: authProfileSaga });

    const { i18n } = useTranslation();
    const authenticated = useSelector(selectLoggedIn);

    moment.tz.setDefault('UTC');

    moment.locale(i18n.language, {
        week: {
            dow: 1,
        },
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (authenticated) {
            dispatch(authActions.profile());
        } else {
            let location = window.location.pathname;
            if (location !== '/' && location !== '/forgot-password') {
                window.location.href = '/';
            }
        }
    }, [dispatch, authenticated]);

    const userDetails = useSelector(selectLoggedInUserDetails);
    const selectedTheme = useSelector(selectTheme);

    if (!authenticated && !userDetails) {
        return (
            <ThemeProvider theme={selectedTheme}>
                <CssBaseline />
                <BrowserRouter>
                    <Switch>
                        <Route
                            key="signIn"
                            path="/"
                            exact
                            component={({ location, ...props }) => (
                                <PublicRoute>
                                    <SignIn />
                                </PublicRoute>
                            )}
                        />
                        <Route
                            key="forgotPassword"
                            path="/forgot-password"
                            exact
                            component={({ location, ...props }) => (
                                <PublicRoute>
                                    <ForgetPass />
                                </PublicRoute>
                            )}
                        />
                    </Switch>
                </BrowserRouter>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={selectedTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Helmet
                    titleTemplate="%s - Stanley ELU Remote Monitoring Portal"
                    defaultTitle={`Stanley ELU Remote Monitoring Portal ${authenticated ? '(.)' : ''}`}
                    htmlAttributes={{ lang: i18n.language }}
                >
                    <meta name="description" content="Stanley ELU Remote Monitoring Portal application" />
                </Helmet>

                <Switch>
                    {userDetails && (
                        <Route exact path="/">
                            <Redirect to="/home" />
                        </Route>
                    )}
                    {authenticated && <AppRoutes />}
                    {!authenticated && <Route component={NotFoundPage} />}
                </Switch>
                {/* <GlobalStyle /> */}
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
