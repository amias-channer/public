import { logErrorLocally } from '../../loggers/local-logger';
const resourceExpireHeader = 'Resource-Cache-Expires';
export function isExpiredCachedResponse(response) {
    const expirationHeader = response.headers.get(resourceExpireHeader);
    // if there is no expiration header (e.g. browser couldn't set it) we mark response as expired to prevent
    // infinite caching
    if (!expirationHeader) {
        return true;
    }
    return Date.parse(expirationHeader) <= Date.now();
}
export function createExpirableResponse({ response, minutesTtl }) {
    const cachedResponseInit = {
        status: response.status,
        statusText: response.statusText,
        headers: {}
    };
    response.headers.forEach((value, key) => {
        cachedResponseInit.headers[key] = value;
    });
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + minutesTtl);
    cachedResponseInit.headers[resourceExpireHeader] = expires.toUTCString();
    return new Response(response.body, cachedResponseInit);
}
export function deleteExpiredResponses(cache) {
    return cache.keys().then((requests) => {
        return Promise.all(requests.map((request) => {
            return cache.match(request).then((response) => {
                if (response && isExpiredCachedResponse(response)) {
                    return cache.delete(request);
                }
                return true;
            }, logErrorLocally);
        })).then(() => undefined);
    });
}
//# sourceMappingURL=response-utils.js.map