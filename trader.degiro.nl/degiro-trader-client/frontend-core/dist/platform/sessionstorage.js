export function getItem(key) {
    const item = sessionStorage.getItem(key);
    return item && JSON.parse(item);
}
export function setItem(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
}
export function removeItem(key) {
    sessionStorage.removeItem(key);
}
//# sourceMappingURL=sessionstorage.js.map