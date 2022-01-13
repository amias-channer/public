import requestToApi from '../../services/api-requester/request-to-api';
export default function cancelTest(config, taskId) {
    return requestToApi({
        config,
        url: `${config.paUrl}product-governance/category-element/cancel-test/${taskId}`,
        method: 'POST'
    });
}
//# sourceMappingURL=cancel-test.js.map