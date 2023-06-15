/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import FontFaceObserver from 'fontfaceobserver';
import * as serviceWorker from 'serviceWorker';
import { HelmetProvider } from 'react-helmet-async';
import { configureAppStore } from 'store/configureStore';
import compareVersions from 'compare-versions';
import { App } from 'app';
import Constants from 'constants/index';

// Initialize languages
import './locales/i18n';
// import 'scss/main.scss';

// Use consistent styling
// import 'sanitize.css/sanitize.css';

// Observe loading of Inter (to remove 'Inter', remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Inter', {});

// When Inter is loaded, add a font-family using Inter to the body
openSansObserver.load().then(() => {
    document.body.classList.add('fontLoaded');
});

const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

preamble();

ReactDOM.render(
    <Provider store={store}>
        <HelmetProvider>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </HelmetProvider>
    </Provider>,
    MOUNT_NODE,
);

// Hot reloadable translation json files
if (module.hot) {
    module.hot.accept(['./locales/i18n'], () => {
        // No need to render the App again because i18next works with the hooks
    });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

async function preamble() {
    // check if we have the right version
    const { version = '' } = JSON.parse(localStorage.getItem(Constants.storageKeys.version) || '{}');

    if (!version || compareVersions(Constants.version, version) > 0) {
        localStorage.setItem(Constants.storageKeys.version, JSON.stringify({ version: Constants.version }));

        localStorage.removeItem(Constants.storageKeys.authToken);
        localStorage.removeItem(Constants.storageKeys.userDetails);
        localStorage.removeItem(Constants.storageKeys.jwtToken);
    }

    // add other actions below....
}
