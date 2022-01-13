import getQueryString from '../../utils/url/get-query-string';
import { logErrorLocally, logWarningLocally } from '../local-logger';
import * as sentryRetry from './sentry-retry';
/* eslint-disable camelcase */
export default function sendSentryData(sentryDsnInfo, sentryData) {
    if (sentryRetry.isWaiting()) {
        logWarningLocally('Sentry dropped error due to backoff: ', sentryData);
        return;
    }
    fetch(`https://${sentryDsnInfo.host}/api/${sentryDsnInfo.project}/store/?${getQueryString({
        sentry_client: 'raven-js/3.27.0',
        sentry_key: sentryDsnInfo.user,
        sentry_version: '7'
    })}`, {
        method: 'POST',
        // 'origin-only' value causes an error in Chrome:
        //  The provided value 'origin-only' is not a valid enum value of type ReferrerPolicy
        referrerPolicy: 'origin',
        body: JSON.stringify(sentryData)
    })
        .then((response) => {
        if (response.ok) {
            sentryRetry.reset();
        }
        else {
            const error = new Error(`Sentry error code: ${response.status}`);
            sentryRetry.setFromResponse(response);
            logErrorLocally('Sentry transport failed to send: ', error, response);
        }
    })
        .catch((error) => {
        logErrorLocally('Sentry transport failed to send: ', error);
    });
}
//# sourceMappingURL=send-sentry-data.js.map