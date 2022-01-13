import requestToApi from '../../services/api-requester/request-to-api';
export default function activateGroup(config, groupType) {
    return requestToApi({
        config,
        url: `${config.paUrl}product-governance/group/${groupType}/activate`,
        method: 'PUT'
    });
}
//# sourceMappingURL=activate-group.js.map