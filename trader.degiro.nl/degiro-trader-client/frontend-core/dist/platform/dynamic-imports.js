import { logErrorLocally } from '../loggers/local-logger';
import isInternalEnv from './is-internal-env';
export const onChunkLoadingError = (error) => {
    logErrorLocally(error);
    if (onChunkLoadingError.disabled) {
        return;
    }
    onChunkLoadingError.disabled = true;
    if (typeof appVersion !== 'string') {
        return;
    }
    const manifestNode = document.head.querySelector('link[rel="manifest"]');
    const manifestUrl = manifestNode && manifestNode.href;
    if (!manifestUrl) {
        return;
    }
    // add a timestamp to load the latest actual version of Manifest from the server
    /* eslint-disable camelcase */
    fetch(`${manifestUrl}?t=${Date.now()}`)
        .then((response) => response.json())
        .then(({ app_version }) => {
        // do not check app version on test env.
        if (!isInternalEnv() && (!app_version || app_version === appVersion)) {
            throw new Error(`App version did not change: ${appVersion}`);
        }
        if (navigator.serviceWorker) {
            return Promise.race([
                navigator.serviceWorker.ready,
                // we need a timeout (2 seconds) because `.ready` promise might be indefinite
                new Promise((resolve) => setTimeout(resolve, 2000))
            ])
                .then((registration) => {
                return registration === null || registration === void 0 ? void 0 : registration.unregister(); // unregister active Service Worker
            })
                .catch(logErrorLocally); // log error but continue a process
        }
    })
        .then(() => {
        // reload a page from server
        location.reload(true);
    })
        .catch(logErrorLocally);
};
//# sourceMappingURL=dynamic-imports.js.map