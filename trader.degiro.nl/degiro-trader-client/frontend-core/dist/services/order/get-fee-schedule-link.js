import localize from '../i18n/localize';
export default function getFeeScheduleLink(client, i18n) {
    if (client.isCustodyPensionClient) {
        return localize(i18n, 'link.tarifs.pension');
    }
    let tariffsLinkNameSuffix = '';
    if (client.isCustodyClient) {
        tariffsLinkNameSuffix = '_CUSTODY';
    }
    return localize(i18n, 'link.tarifs', {
        0: tariffsLinkNameSuffix
    });
}
//# sourceMappingURL=get-fee-schedule-link.js.map