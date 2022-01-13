import requestToApi from '../../services/api-requester/request-to-api';
export default function startTest(config, elementType) {
    return requestToApi({
        config,
        url: `${config.paUrl}product-governance/category-element/${elementType}/take-test`,
        method: 'POST'
    });
}
//# sourceMappingURL=start-test.js.map