import requestToApi from '../api-requester/request-to-api';
export default function toggleVwdModuleStatus(config, vwdModule) {
    return requestToApi({
        config,
        url: `${config.paUrl}settings/vwdModules`,
        method: 'PUT',
        responseType: 'text',
        body: {
            moduleId: vwdModule.id,
            // inverse true -> false, false -> true
            enabled: !vwdModule.enabled
        }
    }).then(() => undefined);
}
//# sourceMappingURL=toggle-vwd-module-status.js.map