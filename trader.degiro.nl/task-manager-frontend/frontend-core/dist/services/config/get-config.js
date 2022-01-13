import parseUrl from '../../utils/url/parse-url';
import requestToApi from '../api-requester/request-to-api';
const configResponseAdapter = ({ betaLandingPath, landingPath, ...payload }) => ({
    ...payload,
    appNextVersionPath: betaLandingPath,
    appLatestVersionPath: landingPath
});
export default function getConfig(initialConfig) {
    // "external" URL is needed mostly for debug purposes and to help BE developers to run built FE version on local
    // machine
    const externalConfigUrl = parseUrl(location.href).query.configUrl;
    const internalConfigUrl = initialConfig.configUrl || '/login/secure/config/';
    const configUrl = externalConfigUrl ? decodeURIComponent(externalConfigUrl) : internalConfigUrl;
    return requestToApi({ config: initialConfig, url: configUrl }).then((response) => {
        const baseConfig = {
            // for redirect to Login page when request to /config fails
            loginUrl: '/login/',
            logosPath: 'images/logos/',
            ...initialConfig,
            // override the value from 'initialConfig'
            configUrl
        };
        return {
            ...baseConfig,
            ...configResponseAdapter(response)
        };
    });
}
//# sourceMappingURL=get-config.js.map