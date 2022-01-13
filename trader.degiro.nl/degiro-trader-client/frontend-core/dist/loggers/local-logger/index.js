/* eslint-disable func-style, no-console */
export const logMessageLocally = function logMessageLocally() {
    if (isProdBuild) {
        return;
    }
    console.log.apply(console, arguments);
};
export const logErrorLocally = function logErrorLocally() {
    if (isProdBuild) {
        return;
    }
    if (!console.error) {
        return console.log.apply(console, arguments);
    }
    console.error.apply(console, arguments);
};
export const logWarningLocally = function logWarningLocally() {
    if (isProdBuild) {
        return;
    }
    if (!console.warn) {
        return console.log.apply(console, arguments);
    }
    return console.warn.apply(console, arguments);
};
//# sourceMappingURL=index.js.map