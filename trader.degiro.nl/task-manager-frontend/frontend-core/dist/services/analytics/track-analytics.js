import { TrackerEventTypes as Events } from '../../models/analytics';
import trackBrazeAnalytics from './track-braze-analytics';
import trackFirebaseAnalytics from './track-firebase-analytics';
import trackGoogleTagManagerAnalytics from './track-google-tag-manager-analytics';
const googleTagManagerWhiteList = [
    (...args) => args[0] === Events.LOGIN,
    (...args) => args[0] === Events.CREATE_ACCOUNT,
    (...args) => args[0] === Events.USER_ACTIVATED,
    (...args) => args[0] === Events.TASK_COMPLETE,
    (...args) => args[0] === Events.PHONE_NUMBER_PROVIDED,
    (...args) => args[0] === Events.VIRTUAL_PAGEVIEW && /^\/login/.test(args[1].page),
    (...args) => args[0] === Events.VIRTUAL_PAGEVIEW && /^\/registration/.test(args[1].page),
    (...args) => args[0] === Events.VIRTUAL_PAGEVIEW && /^\/account/.test(args[1].page)
];
const firebaseEventsWhitelist = [
    (...args) => args[0] === Events.ORDER_PLACED,
    (...args) => args[0] === Events.ORDER_MODIFIED,
    (...args) => args[0] === Events.ORDER_DELETED,
    (...args) => args[0] === Events.DEPOSIT,
    (...args) => args[0] === Events.WITHDRAWAL,
    (...args) => args[0] === Events.VIRTUAL_PAGEVIEW &&
        !/^\/login/.test(args[1].page) &&
        !/^\/registration/.test(args[1].page) &&
        !/^\/account/.test(args[1].page)
];
const brazeEventsWhiteList = [
    (...args) => args[0] === Events.DEPOSIT,
    (...args) => args[0] === Events.ORDER_PLACED,
    (...args) => args[0] === Events.FIRST_TRADER_PAGE_LOAD_AFTER_LOGIN,
    (...args) => args[0] === Events.VIRTUAL_PAGEVIEW &&
        (args[1].page === '/login/password-login' || args[1].page === '/login/passcode-login')
];
let cache = [];
let tracker = (...arg) => {
    cache.push(arg);
};
const trackAnalytics = (...args) => tracker(...args);
const waitForNextRender = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
trackAnalytics.init = async (mainClient, currentClient) => {
    // IMPORTANT: do not block Time to interactive
    await waitForNextRender();
    await Promise.all([
        trackFirebaseAnalytics.init(mainClient, currentClient),
        trackBrazeAnalytics.init(mainClient),
        trackGoogleTagManagerAnalytics.init(mainClient, currentClient)
    ]);
    tracker = (...args) => {
        if (googleTagManagerWhiteList.some((check) => check(...args))) {
            trackGoogleTagManagerAnalytics(...args);
        }
        if (firebaseEventsWhitelist.some((check) => check(...args))) {
            trackFirebaseAnalytics(...args);
        }
        if (brazeEventsWhiteList.some((check) => check(...args))) {
            trackBrazeAnalytics(...args);
        }
    };
    cache.forEach((args) => tracker(...args));
    cache = [];
};
export default trackAnalytics;
//# sourceMappingURL=track-analytics.js.map