import getCoreConfig from 'frontend-core/dist/services/config/get-config';
import {Config as CoreConfig} from 'frontend-core/dist/models/config';
import {Config} from '../../models/config';

const initialConfig: Partial<CoreConfig> = {
    configUrl: '/login/secure/config',
    loginUrl: '/login'
};

export default async function getConfig(): Promise<Config> {
    const coreConfig: CoreConfig = await getCoreConfig(initialConfig);

    return {
        ...coreConfig,
        // '/' in the end of `loginUrl` could be missed
        traderUrl: `${coreConfig.loginUrl.replace(/\/$/, '')}/redirectToWebTrader`,
        defaultApiDateFormat: 'YYYY-MM-DD'
    };
}
