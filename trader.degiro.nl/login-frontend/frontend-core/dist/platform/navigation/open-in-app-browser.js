import isWebViewApp from '../is-web-view-app';
export default function openInAppBrowser(props) {
    var _a;
    if (isWebViewApp()) {
        const InAppBrowser = (_a = window.cordova) === null || _a === void 0 ? void 0 : _a.InAppBrowser;
        if (!InAppBrowser) {
            return;
        }
        const options = {
            // show location by default
            location: 'yes',
            ...props.options
        };
        const optionsQueryParamsPairs = Object.entries(options).map(([key, value]) => `${key}=${value}`);
        // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
        // open in the System browser by default
        InAppBrowser.open(props.url, props.target || '_system', optionsQueryParamsPairs.join(','));
        return;
    }
    // it's important because in the original browser we should go by link
    return window.location.replace(props.url);
}
//# sourceMappingURL=open-in-app-browser.js.map