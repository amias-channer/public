import { logErrorLocally } from '../../loggers/local-logger';
import { TrackerEventTypes } from '../../models/analytics';
let currentClient;
let mainClient;
const trackGoogleTagManagerAnalytics = (...eventNameAndProps) => {
    if (!currentClient || !mainClient) {
        logErrorLocally("You should initialize 'trackGoogleTagManagerAnalytics' function before usage. " +
            "Please use 'trackGoogleTagManagerAnalytics.init(mainClient, currentClient)'");
        return;
    }
    const globalThis = window;
    // GTM loads async
    globalThis.dataLayer = globalThis.dataLayer || [];
    const { amCode, locale } = currentClient;
    const culture = locale === null || locale === void 0 ? void 0 : locale.split('_')[1];
    const language = locale === null || locale === void 0 ? void 0 : locale.split('_')[0];
    switch (eventNameAndProps[0]) {
        case TrackerEventTypes.LOGIN: {
            const { location, userId } = eventNameAndProps[1];
            // TODO: this is "historical" solution, there are no technical reasons of doing this
            globalThis.dataLayer.push({ event: eventNameAndProps[0], location, userId });
            globalThis.dataLayer.push({ userId, amCode, culture, language });
            return;
        }
        default: {
            globalThis.dataLayer.push({
                userId: currentClient.id,
                hasIntAccount: currentClient.intAccount != null,
                isAmClient: mainClient.intAccount !== currentClient.intAccount,
                event: eventNameAndProps[0],
                amCode,
                culture,
                language,
                ...eventNameAndProps[1]
            });
        }
    }
};
trackGoogleTagManagerAnalytics.init = (initMainClient, initCurrentClient) => {
    currentClient = initCurrentClient;
    mainClient = initMainClient;
};
export default trackGoogleTagManagerAnalytics;
//# sourceMappingURL=track-google-tag-manager-analytics.js.map