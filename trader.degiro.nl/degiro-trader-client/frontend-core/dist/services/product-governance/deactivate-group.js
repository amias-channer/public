import requestToApi from '../../services/api-requester/request-to-api';
export default function deactivateGroup(config, groupType) {
    return requestToApi({
        config,
        url: `${config.paUrl}product-governance/group/${groupType}/deactivate`,
        method: 'PUT'
    });
}
//# sourceMappingURL=deactivate-group.js.map