export function getCache(cacheName) {
    return new Promise((resolve, reject) => {
        // `caches` or `caches.open` might be undefined or disabled
        caches.open(cacheName).then(resolve, reject);
    });
}
export function deleteCache(cacheName) {
    return new Promise((resolve, reject) => {
        // `caches` or `caches.delete` might be undefined or disabled
        caches.delete(cacheName).then(() => resolve(), reject);
    });
}
//# sourceMappingURL=cache-utils.js.map