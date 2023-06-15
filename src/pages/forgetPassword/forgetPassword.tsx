import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Link, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import Switch from '@mui/material/Switch';
import EluLogoDark from 'assets/images/EluLogoDark.svg';
import EluLogoLight from 'assets/images/EluLogoLight.svg';

import { useSelector, useDispatch } from 'react-redux';
import { selectLoginIsLoading, selectLoginError } from 'services/login/login-selectors';
import { loginKey, loginReducer } from 'services/login/login-reducer';
import { loginSaga } from 'services/login/sagas';

import { messages } from './messages';
import { changeTheme, selectThemeKey, themeSliceKey, reducer as changeThemeReducer } from 'styles/theme/slice';
import { saveTheme } from 'styles/theme/utils';
import { ThemeKeyType } from 'styles/theme/types';
import constants, { Images } from '../../constants';
import { Tenants } from 'constants/defaultDateConfig';
import { useHistory } from 'react-router-dom';

interface SignInProps {}
const isEmailValid = (email: string) => {
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    return !reg.test(email) ? false : true;
};

export const ForgetPass = (props: SignInProps) => {
    useInjectReducer({ key: loginKey, reducer: loginReducer });
    useInjectSaga({ key: loginKey, saga: loginSaga });
    useInjectReducer({ key: themeSliceKey, reducer: changeThemeReducer });

    const [email, setEmail] = useState('');
    const [emailValidationError, setEmailValidationError] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordValidationError, setPasswordValidationError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [passValidateError, setPassValidateError] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [validOtpEntered, setValidOtpEntered] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0].toLocaleLowerCase();

    tenant = tenant === 'v1daimler' ? 'daimler' : tenant;

    const dispatch = useDispatch();
    const history = useHistory();
    const theme = useSelector(selectThemeKey);

    const loginError = useSelector(selectLoginError);

    const apiCall = async (URL, data) => {
        setIsLoading(true);
        return new Promise(async (resolve, reject) => {
            fetch(URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(async (res) => {
                    if (res.ok) {
                        res = await res.json();
                        return res;
                    }
                    alert('API Failed to change password please try again');
                    history.push('/');
                })
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
                .finally(() => setIsLoading(false));
        });
    };

    const handleEmail = (value) => {
        const isValid = isEmailValid(value);
        isValid ? setEmailValidationError(false) : setEmailValidationError(true);
        setEmail(value);
    };

    const handleConfirmPassword = (value) => {
        if (value.length > 0) {
            if (value !== password) {
                setConfirmError(true);
                setPassValidateError(false);
            } else if (value.length < 8) {
                setPassValidateError(true);
                setConfirmError(false);
            } else {
                confirmError && setConfirmError(false);
            }
        }
        setPasswordConfirm(value);
    };

    const validator = () => {
        if (confirmError) {
            return 'Passwords do not match';
        }
        if (passValidateError) {
            return 'Password must be 8 characters';
        }
    };

    const handleButtonClick = async (e) => {
        e?.preventDefault();
        if (!otpSent) {
            if (!email.length) return setEmailValidationError(true);
            const URL = `${constants.forgetPassword}?tenant=${tenant}`;
            apiCall(URL, { email })
                .then((res: any) => {
                    if (res?.status) {
                        setOtpSent(true);
                    } else {
                        alert(res?.message);
                        setOtpSent(false);
                    }
                })
                .catch((err) => alert(err));
        } else if (!otpVerified && validOtpEntered) {
            setOtpVerified(true);
        } else {
            if (password !== passwordConfirm) {
                return setConfirmError(true);
            }

            if (password.length < 8) {
                return setPassValidateError(true);
            }
            const URL = `${constants.resetPassword}?tenant=${tenant}`;
            const obj = {
                email,
                confirmationCode: otp,
                password,
            };
            apiCall(URL, obj)
                .then((res: any) => {
                    if (res?.status) {
                        alert(res?.message);
                        history.push('/');
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    const handleOtp = (e) => {
        const { value } = e.target;
        setOtp(value);
        setValidOtpEntered(otpSent && value.length === 6);
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const value = (checked ? 'dark' : 'light') as ThemeKeyType;
        saveTheme(value);
        dispatch(changeTheme(value));
    };

    const { t } = useTranslation();
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
                        <Grid item xs={10}></Grid>

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
                        {!otpVerified && !otpSent && (
                            <Grid item xs={12}>
                                <TextField
                                    error={email.length > 0 ? emailValidationError : false}
                                    type="email"
                                    autoComplete="off"
                                    fullWidth
                                    id="outlined-error-helper-text"
                                    placeholder="Enter your Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => handleEmail(e.target.value)}
                                    helperText={
                                        email.length > 0 ? (emailValidationError ? 'Invalid Email' : null) : null
                                    }
                                />
                            </Grid>
                        )}
                        {!otpVerified && otpSent && (
                            <Grid item xs={12}>
                                <TextField
                                    type="number"
                                    autoComplete="off"
                                    fullWidth
                                    id="outlined-basic"
                                    placeholder="Enter OTP"
                                    variant="outlined"
                                    value={otp}
                                    onChange={(e) => handleOtp(e)}
                                    helperText={passwordValidationError}
                                    // error={otp.length < 6}
                                    required={true}
                                />
                            </Grid>
                        )}
                        {otpVerified && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        type="password"
                                        autoComplete="off"
                                        fullWidth
                                        id="outlined-basic"
                                        placeholder="New Password"
                                        variant="outlined"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        helperText={emailValidationError}
                                        required
                                    />
                                </Grid>{' '}
                                <Grid item xs={12}>
                                    <TextField
                                        type="password"
                                        autoComplete="off"
                                        fullWidth
                                        id="outlined-basic"
                                        placeholder="Confirm Password"
                                        variant="outlined"
                                        value={passwordConfirm}
                                        onChange={(e) => handleConfirmPassword(e.target.value)}
                                        helperText={validator()}
                                        // error={confirmError || passValidateError ? true : false}
                                        error={confirmError || passValidateError}
                                        required
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item sm />
                        <Grid item xs={12}>
                            {otpVerified && (
                                <LoadingButton
                                    disabled={!passwordConfirm || !password}
                                    fullWidth
                                    variant="contained"
                                    loading={isLoading}
                                    onClick={(e) => handleButtonClick(e)}
                                >
                                    {'Reset Password'}
                                </LoadingButton>
                            )}
                            {otpSent && !otpVerified && (
                                <LoadingButton
                                    disabled={otp.length < 6}
                                    fullWidth
                                    variant="contained"
                                    loading={isLoading}
                                    onClick={(e) => handleButtonClick(e)}
                                >
                                    Next
                                </LoadingButton>
                            )}
                            {!otpSent && (
                                <LoadingButton
                                    disabled={emailValidationError}
                                    fullWidth
                                    variant="contained"
                                    loading={isLoading}
                                    onClick={(e) => handleButtonClick(e)}
                                >
                                    {'Request Otp'}
                                </LoadingButton>
                            )}
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </>
    );
};

export default ForgetPass;
