import { AppError } from '../../models/app-error';
import setAccountInfoToClient from './set-account-info-to-client';
export default function switchCurrentClient(config, mainClient, options) {
    const { intAccount } = options;
    const isMainClient = mainClient.intAccount === intAccount;
    let currentClient;
    if (isMainClient) {
        currentClient = { ...mainClient };
    }
    else {
        const selectedClient = (mainClient.clientAccounts || []).find((client) => {
            return client.intAccount === intAccount;
        });
        currentClient = selectedClient && { ...selectedClient };
    }
    if (!currentClient) {
        return Promise.reject(new AppError({ text: 'Client not found' }));
    }
    function prepareCurrentClient(currentClient) {
        // use general settings for all client accounts
        return {
            ...currentClient,
            settings: mainClient.settings
        };
    }
    // we already have all the data
    if (isMainClient) {
        return Promise.resolve(prepareCurrentClient(currentClient));
    }
    return setAccountInfoToClient(config, currentClient).then(prepareCurrentClient);
}
//# sourceMappingURL=switch-current-client.js.map