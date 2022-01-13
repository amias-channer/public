import requestToApi from '../api-requester/request-to-api';
export default function getVwdModules(config, params) {
    return requestToApi({
        config,
        url: `${config.paUrl}settings/vwdModules`,
        method: 'GET',
        params
    });
}
//# sourceMappingURL=get-vwd-modules.js.map