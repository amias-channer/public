/*
 * Access to LocalStorage methods triggers an error in Incognito mode in some browsers
 */
/**
 *
 * @param {string} key
 * @returns {*}
 */
export function getItem(key) {
    let data;
    try {
        const item = localStorage.getItem(key);
        data = item && JSON.parse(item);
    }
    catch (_a) {
        //
    }
    return data;
}
export function setItem(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch (_a) {
        //
    }
}
export function removeItem(key) {
    try {
        localStorage.removeItem(key);
    }
    catch (_a) {
        //
    }
}
//# sourceMappingURL=localstorage.js.map