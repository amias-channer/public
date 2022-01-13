import {appContainer, rootContainerWebView} from 'frontend-core/dist/components/ui-onboarding/index.css';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {initRemoteLogger, logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import loadAppShell from 'frontend-core/dist/platform/load-app-shell';
import loadFonts from 'frontend-core/dist/platform/load-fonts';
import saveUtmParams from 'frontend-core/dist/services/analytics/save-utm-params';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';
import AppComponent, {defaultUrl} from './components/app-component';

declare const appVersion: string;

initRemoteLogger({
    dsn: 'https://a262d337420a46c18592d677bd3666c7@diagnostic.degiro.nl/5',
    release: String(appVersion)
});

export function checkDefaultUrl() {
    const {href} = window.location;

    // [WF-1917]
    if (href.indexOf('#') < 0) {
        window.location.replace(`${href}#${defaultUrl}`);
    }
}

checkDefaultUrl();
loadAppShell()
    .then((appElement: HTMLElement) => {
        appElement.className = `${appElement.className || ''} ${appContainer} ${
            isWebViewApp() ? rootContainerWebView : ''
        }`;

        ReactDOM.render(
            <Router>
                <Route path="/" key="rootRoute" component={AppComponent} />
            </Router>,
            appElement
        );
    })
    .catch((error: Error) => {
        logErrorLocally(error);
        logErrorRemotely(error);
    });
loadFonts().catch(logErrorLocally);
saveUtmParams();
