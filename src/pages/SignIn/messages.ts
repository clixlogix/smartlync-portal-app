import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    pageTitle: _t(translations.SignIn.PageTitle, 'Log In'),
    title: _t(translations.SignIn.Title, 'Login'),
    emailPlaceholder: _t(translations.SignIn.Email.Placeholder, 'Email'),
    passwordPlaceholder: _t(translations.SignIn.Password.Placeholder, 'Password'),
    keepLoggedIn: _t(translations.SignIn.LoggedIn, 'Keep me logged in'),
    loginButtonLabel: _t(translations.SignIn.LoginButton.Label, 'Log In'),
    loginButtonLoading: _t(translations.SignIn.LoginButton.Loading, 'Log In'),
    forgetUsernameOrPassword: _t(translations.SignIn.ForgetUsernameOrPassword, 'Forgot password?'),
    newUser: _t(translations.SignIn.NewUser, 'New User'),
    requestAccess: _t(translations.SignIn.RequestAccess, 'Request Access'),
    termCondition: _t(translations.SignIn.TermCondition, 'I accept the Terms and Conditions'),
    validEmailRequired: _t(
        translations.SignIn.Error.ValidEmailRequired,
        'Required: Please provide a valid email address.',
    ),
    validPasswordRequired: _t(
        translations.SignIn.Error.ValidPasswordRequired,
        'Required: Please provide a valid pasword.',
    ),
};

export default messages;
