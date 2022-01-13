import getAccountInfo from './get-account-info';
export default function setAccountInfoToClient(config, client) {
    const { intAccount } = client;
    // [WF-1198]
    if (intAccount == null) {
        return Promise.resolve(client);
    }
    return getAccountInfo(config, { intAccount }).then((accountInfo) => ({ ...client, accountInfo }));
}
//# sourceMappingURL=set-account-info-to-client.js.map