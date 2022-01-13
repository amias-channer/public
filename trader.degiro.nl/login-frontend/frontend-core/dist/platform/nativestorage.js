/**
 * @description Returns a wrapper for Promise.reject() method
 * @param {string} errorHead
 * @param {Function} reject
 * @returns {Function}
 */
function createErrorHandler(errorHead, reject) {
    return (error) => {
        const errorBody = typeof error === 'string' ? error : error ? `${error.code}:${error.source}` : 'unknown error';
        reject(new Error(`${errorHead} ${errorBody}`));
    };
}
/**
 *
 * @param {string} key
 * @returns {Promise<object>}
 */
export function getItem(key) {
    const { NativeStorage } = window;
    return new Promise((resolve, reject) => {
        const onError = createErrorHandler('[NativeStorage.getItem]', reject);
        if (NativeStorage) {
            NativeStorage.getItem(key, (json) => resolve(JSON.parse(json)), onError);
        }
        else {
            onError('NATIVE_STORAGE_NOT_SUPPORTED');
        }
    });
}
/**
 *
 * @param {string} key
 * @param {object} data
 * @returns {Promise<void>}
 */
export function setItem(key, data) {
    const { NativeStorage } = window;
    return new Promise((resolve, reject) => {
        const onError = createErrorHandler('[NativeStorage.setItem]', reject);
        if (NativeStorage) {
            NativeStorage.setItem(key, JSON.stringify(data), resolve, onError);
        }
        else {
            onError('NATIVE_STORAGE_NOT_SUPPORTED');
        }
    });
}
/**
 *
 * @param {string} key
 * @returns {Promise<void>}
 */
export function removeItem(key) {
    const { NativeStorage } = window;
    return new Promise((resolve, reject) => {
        const onError = createErrorHandler('[NativeStorage.remove]', reject);
        if (NativeStorage) {
            NativeStorage.remove(key, resolve, onError);
        }
        else {
            onError('NATIVE_STORAGE_NOT_SUPPORTED');
        }
    });
}
//# sourceMappingURL=nativestorage.js.map