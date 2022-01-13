import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default function getMissingProductGovernanceGroups(config, productId) {
    return requestToApi({
        config,
        url: `${config.tradingUrl}v5/missing-product-governance-groups/${productId}${getPathCredentials(config)}`
    });
}
//# sourceMappingURL=get-missing-product-governance-groups.js.map