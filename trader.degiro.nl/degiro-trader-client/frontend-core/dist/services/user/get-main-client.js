import { logErrorLocally } from '../../loggers/local-logger';
import getAppSettings from '../app-settings/get-app-settings';
import getAppVersionSettings from '../app-version-settings/get-app-version-settings';
import getClientInfo from './get-client-info';
import getClientSettings from './get-client-settings';
import setAccountInfoToClient from './set-account-info-to-client';
export default async function getMainClient(config, options = {}) {
    const { intAccount: intAccountOption } = options;
    const clientInfo = await getClientInfo(config, intAccountOption == null ? undefined : { intAccount: intAccountOption });
    const { intAccount } = clientInfo;
    const [mainClient, settings, appSettings, appVersionSettings] = await Promise.all([
        setAccountInfoToClient(config, clientInfo),
        intAccount == null ? undefined : getClientSettings(config, { intAccount }),
        intAccount == null
            ? undefined
            : // proceed in error case
                getAppSettings(config, { intAccount }).catch(logErrorLocally),
        intAccount == null
            ? undefined
            : // this request returns 404 if settings are not set, but we should not throw an error
                getAppVersionSettings(config, { intAccount }).catch(logErrorLocally)
    ]);
    return {
        ...mainClient,
        settings,
        appSettings,
        appVersionSettings
    };
}
//# sourceMappingURL=get-main-client.js.map