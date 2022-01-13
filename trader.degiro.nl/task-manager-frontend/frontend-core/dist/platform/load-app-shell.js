import addIosWebViewPositionFix from './add-ios-webview-position-fix';
import { registerAppDeepLinks } from './app-deep-link';
import { addCustomUrlListener } from './custom-url-scheme';
import onDeviceReady from './on-device-ready';
import { setBackgroundColor, setDarkContentColor, setLightContentColor } from './status-bar';
export default function loadAppShell(options) {
    const statusBar = (options && options.statusBar) || {};
    const { backgroundColor: statusBarBackgroundColor = true } = statusBar;
    return onDeviceReady().then(() => {
        if (statusBarBackgroundColor !== false) {
            let themeColor;
            if (statusBarBackgroundColor === true) {
                // PWA theme
                const themeColorEl = document.querySelector('meta[name="theme-color"]');
                themeColor = themeColorEl && themeColorEl.content;
            }
            else {
                themeColor = statusBarBackgroundColor;
            }
            if (themeColor) {
                setBackgroundColor(themeColor);
                if (statusBar.lightContentColor) {
                    setLightContentColor();
                }
                else {
                    setDarkContentColor();
                }
            }
        }
        const appElement = document.getElementById('appContainer');
        if (!appElement) {
            const { body } = document;
            throw new Error(`#appContainer is not found. document.body: ${body && body.innerHTML}`);
        }
        addCustomUrlListener();
        registerAppDeepLinks();
        addIosWebViewPositionFix();
        return appElement;
    });
}
//# sourceMappingURL=load-app-shell.js.map