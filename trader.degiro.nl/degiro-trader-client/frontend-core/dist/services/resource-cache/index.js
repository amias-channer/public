import { logErrorLocally } from '../../loggers/local-logger';
import cleanupUrl from '../../utils/url/cleanup-url';
import { deleteCache, getCache } from './cache-utils';
import { createExpirableResponse, deleteExpiredResponses, isExpiredCachedResponse } from './response-utils';
/**
 * @description Utility class for resource aching based on Cache API.
 *  Ideally each instance of the class is responsible for 1 service (e.g. separate for /favorites and /client),
 *  but it's allowed to use an instance which serves multiple similar services (e.g. pr. search: /stocks, /bond, etc.)
 *  This class uses Cache API to achieve several goals:
 *  - Shared cache for main thread and workers (useful for products info cache)
 *  - First step towards offline-mode support
 * @example
 *  const productsSearchCache = new ResourceCache({
 *      name: 'cache-products-search',
 *      minutesTtl: 5
 *  });
 * @class
 */
export default class ResourceCache {
    constructor(props) {
        this.ignoredSearchParams = ['sessionId'];
        this.ignoredPathSegments = ['jsessionid'];
        const { name } = props;
        // same prefix as in ServiceWorker static caches
        const requiredNamePrefix = 'cache-';
        if (name.indexOf(requiredNamePrefix) !== 0) {
            throw new Error(`Cache name should start from "${requiredNamePrefix}" prefix. Actual: ${name}`);
        }
        if (/[A-Z]/.test(name)) {
            throw new Error(`Use kebab-case for the cache name - ${name}`);
        }
        this.name = name;
        this.minutesTtl = props.minutesTtl;
    }
    getUrlForCache(url) {
        return cleanupUrl({
            url,
            ignoredPathSegments: this.ignoredPathSegments,
            ignoredSearchParams: this.ignoredSearchParams
        });
    }
    get(options) {
        return getCache(this.name).then((cache) => {
            const resourceUrl = this.getUrlForCache(options.url);
            return cache.match(resourceUrl).then((response) => {
                if (response && !isExpiredCachedResponse(response)) {
                    return response;
                }
            });
        });
    }
    set(options) {
        const cacheName = this.name;
        return getCache(cacheName).then((cache) => {
            const resourceUrl = this.getUrlForCache(options.url);
            // We need to recheck from time to time that cache doesn't have "dead" cached responses.
            // It's better to empty cache/release memory before we put new data
            return deleteExpiredResponses(cache)
                .catch((error) => {
                logErrorLocally('Failed to delete expired responses', { cacheName, error });
            })
                .then(() => cache.put(resourceUrl, createExpirableResponse({
                response: options.response,
                minutesTtl: this.minutesTtl
            })));
        });
    }
    clear() {
        return deleteCache(this.name);
    }
}
//# sourceMappingURL=index.js.map