import requestToApi from '../api-requester/request-to-api';
import ResourceCache from '../resource-cache/index';
export const dictionaryCache = new ResourceCache({
    name: 'cache-dictionary',
    minutesTtl: 60
});
export default function getDictionary(config) {
    return requestToApi({
        config,
        url: config.dictionaryUrl,
        cache: dictionaryCache
    });
}
//# sourceMappingURL=get-dictionary.js.map