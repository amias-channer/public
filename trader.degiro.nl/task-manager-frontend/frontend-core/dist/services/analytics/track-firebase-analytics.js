import isWebViewApp from '../../platform/is-web-view-app';
import { TrackerEventTypes } from '../../models/analytics';
import getFirebaseAnalytics from './get-firebase-analytics';
import { logErrorLocally } from '../../loggers/local-logger';
let mainClient;
let currentClient;
const trackFirebaseAnalytics = async (...eventNameAndProps) => {
    var _a;
    if (!mainClient || !currentClient) {
        logErrorLocally("You should initialize 'trackFirebaseAnalytics' function before usage. " +
            "Please use 'trackFirebaseAnalytics.init(mainClient, currentClient)'");
        return;
    }
    try {
        // load Firebase SDK on demand
        const analytics = await getFirebaseAnalytics();
        const [language, culture] = ((_a = currentClient.locale) === null || _a === void 0 ? void 0 : _a.split('_')) || [];
        const userId = currentClient.id;
        const commonEventParams = {
            culture,
            language,
            userId,
            accountType: currentClient.effectiveClientRole,
            isAmClient: mainClient.intAccount !== currentClient.intAccount,
            isApp: isWebViewApp()
        };
        analytics.setUserId(String(userId));
        if (eventNameAndProps[0] === TrackerEventTypes.VIRTUAL_PAGEVIEW) {
            const { page } = eventNameAndProps[1];
            analytics.logEvent(eventNameAndProps[0], {
                ...commonEventParams,
                page: page ? `/trader4/${page.replace(/^\//, '')}` : ''
            });
            return;
        }
        analytics.logEvent('userAction', {
            userAction: eventNameAndProps[0],
            ...commonEventParams,
            ...eventNameAndProps[1]
        });
    }
    catch (error) {
        logErrorLocally(error);
    }
};
trackFirebaseAnalytics.init = (initMainClient, initCurrentClient) => {
    mainClient = initMainClient;
    currentClient = initCurrentClient;
};
export default trackFirebaseAnalytics;
//# sourceMappingURL=track-firebase-analytics.js.map