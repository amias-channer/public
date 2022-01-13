import { TrackerEventTypes } from '../../models/analytics';
import initializeBrazeSdk from './initialize-braze-sdk';
import { logErrorLocally } from '../../loggers/local-logger';
let brazeWebApi;
const trackBrazeAnalytics = (...eventNameAndProps) => {
    if (!brazeWebApi) {
        logErrorLocally("You should initialize 'trackBrazeAnalytics' function before usage. " +
            "Please use 'trackBrazeAnalytics.init(mainClient)'");
        return;
    }
    if (eventNameAndProps[0] === TrackerEventTypes.VIRTUAL_PAGEVIEW) {
        const { page } = eventNameAndProps[1];
        // [TRADER-1453] track specific event for visits of login pages
        if (page === '/login/password-login' || page === '/login/passcode-login') {
            return brazeWebApi.logCustomEvent('loginPageView', eventNameAndProps[1]);
        }
    }
    return brazeWebApi.logCustomEvent(eventNameAndProps[0], eventNameAndProps[1]);
};
trackBrazeAnalytics.init = async (mainClient) => {
    brazeWebApi = await initializeBrazeSdk(mainClient);
};
export default trackBrazeAnalytics;
//# sourceMappingURL=track-braze-analytics.js.map