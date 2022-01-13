import getFilterOptionAll from '../../filter/get-filter-option-all';
import getLeveragedProductAggregateValues from './get-leveraged-product-aggregate-values';
export default async function getLeveragedProductIssuers(config, i18n, addOptionAll) {
    const { issuer = [] } = await getLeveragedProductAggregateValues(config, {
        outputAggregateTypes: ['issuer']
    });
    if (addOptionAll) {
        return [getFilterOptionAll(i18n), ...issuer];
    }
    return issuer;
}
//# sourceMappingURL=get-leveraged-product-issuers.js.map