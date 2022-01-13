function normalizePathname(pathname) {
    return `${pathname.replace(/\/$/, '')}/`;
}
export default function isUserOnNextAppVersion(config) {
    const { appNextVersionPath, appLatestVersionPath } = config;
    if (!appNextVersionPath || appNextVersionPath === appLatestVersionPath) {
        return false;
    }
    return normalizePathname(location.pathname).indexOf(normalizePathname(appNextVersionPath)) === 0;
}
//# sourceMappingURL=is-user-on-next-app-version.js.map