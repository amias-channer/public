import { logErrorLocally } from '../../loggers/local-logger';
import isInternalEnv from '../../platform/is-internal-env';
import isWebViewApp from '../../platform/is-web-view-app';
import getBrazeWebViewApi from '../braze/get-braze-webview-api';
export default async function initializeBrazeSdk({ loggedInPersonId }) {
    const brazeUserId = loggedInPersonId == null ? undefined : String(loggedInPersonId);
    if (isWebViewApp()) {
        const brazeWebViewApi = getBrazeWebViewApi();
        if (brazeWebViewApi) {
            if (brazeUserId) {
                brazeWebViewApi.changeUser(brazeUserId);
            }
            return brazeWebViewApi;
        }
        throw new Error("Can't find brazeWebViewApi in global scope, please check Braze initialization part");
    }
    try {
        // See bundle size issue https://github.com/Appboy/appboy-web-sdk/issues/80
        const { default: brazeWebApi } = await import(/* webpackChunkName: "braze-web-sdk" */ '@braze/web-sdk');
        brazeWebApi.initialize(isInternalEnv() ? '5efb9a18-e0e9-42ee-ac56-896c9c61645b' : '48ef29a6-8098-447b-84fd-73dcf7ca322a', {
            baseUrl: 'sdk.fra-01.braze.eu',
            appVersion: String(appVersion),
            // Take Service Worker under our control
            manageServiceWorkerExternally: true,
            enableLogging: !isProdBuild,
            // Performance: Disable loading a font file by Braze
            doNotLoadFontAwesome: true,
            // Enable HTML in-app messages
            allowUserSuppliedJavascript: true
        });
        // [TRADER-1619] enable "in-app/in-browser" notifications
        brazeWebApi.display.automaticallyShowNewInAppMessages();
        if (brazeUserId) {
            brazeWebApi.changeUser(brazeUserId);
        }
        brazeWebApi.openSession();
        return brazeWebApi;
    }
    catch (error) {
        logErrorLocally(error);
        throw error;
    }
}
//# sourceMappingURL=initialize-braze-sdk.js.map