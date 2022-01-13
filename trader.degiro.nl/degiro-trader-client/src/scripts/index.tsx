import {loadIcons} from 'frontend-core/dist/components/ui-trader4/icon';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import loadAppShell from 'frontend-core/dist/platform/load-app-shell';
import loadFonts from 'frontend-core/dist/platform/load-fonts';
import redirectToLoginPage from 'frontend-core/dist/services/user/redirect-to-login-page';
import parseExternalRedirectUrl from 'frontend-core/dist/utils/url/parse-external-redirect-url';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';
import AppComponent from './components/app-component';
import {initialConfig} from './models/config';
import {newCommonOrderParam} from './navigation';

const urlToRedirect: string = parseExternalRedirectUrl(window.location);

if (urlToRedirect) {
    window.location.replace(
        urlToRedirect
            // [WF-1629] normalize hardcoded hash prefix
            .replace('/#!/', '/#/')

            // [WF-2393] support hardcoded profile URLs
            .replace('#/profile/information/details', `#${Routes.PERSONAL_INFORMATION}`)

            /**
             * [WEB-3391] BE has hardcoded URLs to open an order from external sources (also it's compatible with WT v3)
             * We should replace the navigation pathname to default, but leave the query params in URL,
             * <OrderFormsController/> will pick them up
             */
            .replace('#/order/products/all?', `#${Routes.DEFAULT}?${newCommonOrderParam}&`)
    );
} else {
    Promise.all([
        loadAppShell({
            statusBar: {
                lightContentColor: true
            }
        }),
        loadIcons()
    ])
        .then(([appElement]: [HTMLElement, void]) => {
            if (isWebViewApp()) {
                document.documentElement.dataset.webviewApp = 'true';
            }

            ReactDOM.render(
                <Router>
                    <Route path="/" key="rootRoute">
                        <AppComponent />
                    </Route>
                </Router>,
                appElement
            );
        })
        .catch((error: Error) => {
            logErrorLocally(error);

            // eslint-disable-next-line no-debugger
            debugger;
            logErrorRemotely(error);
            redirectToLoginPage(initialConfig);
        });
    loadFonts({
        // exclude "Suisse"
        'Suisse Intl': false,

        // include "Roboto" without specific testing string
        Roboto: null
    }).catch(logErrorLocally);
}
