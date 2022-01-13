/**
 * @description Sets a background of the app status bar
 * @param {string} color - 'red', 'white', #333, #FFAABB
 */
export function setBackgroundColor(color) {
    const { StatusBar } = window;
    try {
        // cordova plugin
        if (color[0] === '#') {
            StatusBar === null || StatusBar === void 0 ? void 0 : StatusBar.backgroundColorByHexString(color);
        }
        else {
            StatusBar === null || StatusBar === void 0 ? void 0 : StatusBar.backgroundColorByName(color);
        }
    }
    catch (_a) {
        //
    }
    // PWA theme
    const themeColorEl = document.querySelector('meta[name="theme-color"]');
    if (themeColorEl) {
        themeColorEl.content = color;
    }
}
export function setBlackTranslucentBackgroundColor() {
    var _a;
    try {
        (_a = window.StatusBar) === null || _a === void 0 ? void 0 : _a.styleBlackTranslucent();
    }
    catch (_b) {
        //
    }
}
export function setDarkContentColor() {
    var _a;
    try {
        (_a = window.StatusBar) === null || _a === void 0 ? void 0 : _a.styleDefault();
    }
    catch (_b) {
        //
    }
}
export function setLightContentColor() {
    var _a;
    try {
        (_a = window.StatusBar) === null || _a === void 0 ? void 0 : _a.styleLightContent();
    }
    catch (_b) {
        //
    }
}
//# sourceMappingURL=status-bar.js.map