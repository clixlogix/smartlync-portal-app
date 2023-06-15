import { useState, MouseEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Link, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Switch from '@mui/material/Switch';
import EluLogoDark from 'assets/images/EluLogoDark.svg';
import EluLogoLight from 'assets/images/EluLogoLight.svg';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoginIsLoading, selectLoginError } from 'services/login/login-selectors';
import { loginActions } from 'services/login/login-reducer';
import { loginKey, loginReducer } from 'services/login/login-reducer';
import { loginSaga } from 'services/login/sagas';

import { messages } from './messages';
import { changeTheme, selectThemeKey, themeSliceKey, reducer as changeThemeReducer } from 'styles/theme/slice';
import { saveTheme } from 'styles/theme/utils';
import { ThemeKeyType } from 'styles/theme/types';
import { Images } from '../../constants';
import { Tenants } from 'constants/defaultDateConfig';

interface SignInProps {}
const isEmailValid = (email: string) => {
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    return !reg.test(email) ? false : true;
};

export const SignIn = (props: SignInProps) => {
    useInjectReducer({ key: loginKey, reducer: loginReducer });
    useInjectSaga({ key: loginKey, saga: loginSaga });
    useInjectReducer({ key: themeSliceKey, reducer: changeThemeReducer });

    const [email, setEmail] = useState('');
    const [emailValidationError, setEmailValidationError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordValidationError, setPasswordValidationError] = useState('');
    const [termConditionCheckbox, setTermConditionCheckbox] = useState(true);
    let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0].toLocaleLowerCase();

    tenant = tenant === 'v1daimler' ? 'daimler' : tenant;

    const dispatch = useDispatch();
    const theme = useSelector(selectThemeKey);

    const isLoading = useSelector(selectLoginIsLoading);
    const loginError = useSelector(selectLoginError);

    const handleLoginButtonClick = async (e: MouseEvent) => {
        e.preventDefault();
        setEmailValidationError('');
        setPasswordValidationError('');
        if (!isEmailValid(email)) {
            setEmailValidationError('Invalid email address');
        }
        if (!password) {
            setPasswordValidationError(`Invalid password`);
        }
        dispatch(loginActions.login({ username: email, password }));
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const value = (checked ? 'dark' : 'light') as ThemeKeyType;
        saveTheme(value);
        dispatch(changeTheme(value));
    };

    const { t } = useTranslation();
    const PUBLIC_URL = process.env.PUBLIC_URL;
    const themeMode: 'light' | 'dark' = useTheme().palette.mode;
    return (
        <>
            <Helmet>
                <title>{t(messages.pageTitle)}</title>
                <meta name="description" content="User Login" />
            </Helmet>
            <AppBar position="static">
                <Grid container spacing={2}>
                    <Grid
                        item
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '16px' }}
                    >
                        <img
                            src={themeMode === 'light' ? EluLogoLight : EluLogoDark}
                            alt={'logo'}
                            style={{ width: '48px', height: '16px' }}
                        />
                    </Grid>
                    {tenant !== 'demo' && (
                        <Grid item sx={{ height: 56, display: 'flex', alignItems: 'center' }}>
                            {tenant === Tenants.JLR && (
                                <>
                                    <img src={Images[Tenants.JLR]} alt={'logo'} style={{ height: 56 }} />
                                    {tenant === Tenants.JLR && (
                                        <img src={Images['LandRover']} alt={'logo'} style={{ height: 56 }} />
                                    )}
                                </>
                            )}
                            {tenant === Tenants.RIVIAN && (
                                <img
                                    src={themeMode === 'dark' ? Images.RivianDarkLogo : Images.RivianLightLogo}
                                    alt={'logo'}
                                    style={{ height: 20 }}
                                />
                            )}
                        </Grid>
                    )}
                    <Grid item sm />
                    {process.env.REACT_APP_ENVIRONMENT === 'development' && (
                        <Switch checked={theme === 'dark'} onChange={handleThemeChange} aria-label="theme switch" />
                    )}
                </Grid>
            </AppBar>
            <Box
                sx={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    backgroundColor: themeMode === 'light' ? '#FAFAFA' : '#121212',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Card sx={{ padding: 2, width: 474 }}>
                    <Grid container spacing={2}>
                        {/* <Grid container sx={{ display: 'flex' }}> */}
                        <Grid item xs={10}>
                            <Typography component={'div'} variant="h5">
                                {t(messages.title)}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <img
                                src={themeMode === 'light' ? EluLogoLight : EluLogoDark}
                                alt={'logo'}
                                style={{ width: '48px', height: '16px' }}
                            />
                        </Grid>
                        {loginError && (
                            <Grid item xs={12}>
                                <Alert data-test="error-msg" severity="error">
                                    {loginError?.message}
                                </Alert>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                autoComplete="off"
                                fullWidth
                                id="outlined-basic"
                                placeholder="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                helperText={emailValidationError}
                                error={emailValidationError.length === 0 ? false : true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                autoComplete="off"
                                fullWidth
                                id="outlined-basic"
                                placeholder="Password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                helperText={passwordValidationError}
                                error={passwordValidationError.length === 0 ? false : true}
                            />
                        </Grid>
                        <Grid item sm />
                        {/* <Grid container sx={{ alignItems: 'center', ml: '10px', mt: '10px' }}>
                            <Grid item xs={1}>
                                <Checkbox
                                    checked={termConditionCheckbox}
                                    onChange={() => setTermConditionCheckbox(!termConditionCheckbox)}
                                />
                            </Grid>
                            <Grid item xs={11}>
                                <Typography component={'div'} color="inherit" variant="subtitle2">
                                    {t(messages.termCondition)}
                                </Typography>
                            </Grid>
                        </Grid> */}

                        <Grid item xs={12}>
                            <LoadingButton
                                disabled={!termConditionCheckbox}
                                fullWidth
                                variant="contained"
                                onClick={handleLoginButtonClick}
                                loading={isLoading}
                            >
                                {t(messages.loginButtonLabel)}
                            </LoadingButton>
                        </Grid>
                        <Grid item xs={12}>
                            {/* <Link href={`${PUBLIC_URL}/new-user`} variant="subtitle2">
                                {t(messages.requestAccess)}
                            </Link> */}
                            <Link href={`${PUBLIC_URL}/forgot-password`} variant="subtitle2">
                                {t(messages.forgetUsernameOrPassword)}
                            </Link>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </>
    );
};

export default SignIn;
