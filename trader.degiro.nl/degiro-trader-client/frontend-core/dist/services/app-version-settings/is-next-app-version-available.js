export default function isNextAppVersionAvailable({ appLatestVersionPath, appNextVersionPath }) {
    return Boolean(appNextVersionPath && appLatestVersionPath !== appNextVersionPath);
}
//# sourceMappingURL=is-next-app-version-available.js.map