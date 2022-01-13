import getMainClient from './get-main-client';
import switchCurrentClient from './switch-current-client';
export default function reloadClientAfterAccountUpgrade(config, mainClient, currentClient) {
    const { intAccount } = currentClient;
    const isMainClient = mainClient.intAccount === intAccount;
    // reload all main client data
    return getMainClient(config).then((newMainClient) => {
        // if we were on non-main account, switch back to it
        if (!isMainClient && intAccount != null) {
            return switchCurrentClient(config, newMainClient, { intAccount }).then((newCurrentClient) => ({
                mainClient: newMainClient,
                currentClient: newCurrentClient
            }));
        }
        return { mainClient: newMainClient, currentClient: newMainClient };
    });
}
//# sourceMappingURL=reload-client-after-account-upgrade.js.map