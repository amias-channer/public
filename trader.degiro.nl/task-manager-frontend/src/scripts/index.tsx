import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {initRemoteLogger, logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import loadAppShell from 'frontend-core/dist/platform/load-app-shell';
import loadFonts from 'frontend-core/dist/platform/load-fonts';
import parseExternalRedirectUrl from 'frontend-core/dist/utils/url/parse-external-redirect-url';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';
import {layout, rootContainerWebView} from '../styles/index.css';
import AppComponent from './components/app-component';
import {Config} from './models/config';
import getConfig from './services/config/get-config';

declare const appVersion: string;

initRemoteLogger({
    dsn: 'http://b24a33b022d04005b8a73f1073185f29@diagnostic.degiro.nl/7',
    release: String(appVersion)
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const urlToRedirect: string = parseExternalRedirectUrl(window.location);

    if (urlToRedirect) {
        return window.location.replace(urlToRedirect);
    }

    try {
        const appElement: HTMLElement = await loadAppShell();
        const config: Config = await getConfig();

        appElement.className = `
            ${appElement.className || ''} 
            ${isWebViewApp() ? rootContainerWebView : ''}
            ${layout}
        `;

        ReactDOM.render(
            <Router>
                <Route path="/" key="rootRoute">
                    <AppComponent config={config} />
                </Route>
            </Router>,
            appElement
        );
    } catch (error) {
        logErrorLocally(error);
        logErrorRemotely(error);
    }

    loadFonts().catch(logErrorLocally);
})();
