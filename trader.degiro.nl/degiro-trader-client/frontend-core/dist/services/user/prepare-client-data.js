import getCountryTimezone from '../../utils/date/get-country-timezone';
import unescape from '../../utils/unescape';
const inviteFriendsLocales = [
    'nl_NL',
    'nl_BE',
    'en_GB',
    'en_IE',
    'fr_FR',
    'fr_BE',
    'de_DE',
    'de_AT',
    'es_ES',
    'da_DK',
    'pt_PT',
    'pl_PL',
    'sv_SE',
    'cs_CZ',
    'it_IT',
    'el_GR',
    'hu_HU',
    'de_CH',
    'fr_CH',
    'it_CH',
    'en_CH'
];
export default function prepareClientData(clientInfo) {
    const { locale = '', clientRole = '', effectiveClientRole = '', culture = '', displayName, cellphoneNumber, phoneNumber, company } = clientInfo;
    const clientLanguage = clientInfo.language || locale.split('_')[0];
    const userData = {
        ...clientInfo,
        language: clientLanguage,
        // TODO: remove this line after deploying of [TRADER-1123] to production
        displayLanguage: clientInfo.displayLanguage || clientLanguage,
        timezone: getCountryTimezone(culture),
        clientRoleTranslation: `clientRole.${clientRole}`,
        effectiveRoleTranslation: `clientRole.${effectiveClientRole}`,
        isPaClient: clientRole === 'pa',
        isCustodyClient: clientRole === 'custody',
        isCustodyPensionClient: clientRole === 'custodyPension' || clientRole === 'custodyPensionPlus',
        isBasic: clientRole === 'basic',
        isEffectiveBasic: effectiveClientRole === 'basic',
        isView: clientRole === 'view',
        isActive: clientRole === 'active',
        isEffectiveActive: effectiveClientRole === 'active',
        isAssetManager: clientRole === 'assetManager',
        isTrader: clientRole === 'trader',
        isEffectiveTrader: effectiveClientRole === 'trader',
        isIntraday: clientRole === 'intraday',
        canInviteFriends: inviteFriendsLocales.includes(locale),
        // [WF-2132]
        areCurrencySettingsAvailable: culture !== 'HU',
        // unescaping
        displayName: displayName && unescape(displayName),
        cellphoneNumber: cellphoneNumber && unescape(cellphoneNumber),
        phoneNumber: phoneNumber && unescape(phoneNumber),
        company: company && { ...company, name: unescape(company.name) },
        // Recursively prepare data for each child account
        clientAccounts: (clientInfo.clientAccounts || []).map(prepareClientData)
    };
    // for PA users show always all positions, [WEB-2289]
    userData.canFilterPortfolioPositions = !userData.isPaClient;
    userData.hasMarginReport = userData.isTrader || userData.isActive || userData.isIntraday;
    userData.hasOvernightReport = userData.isIntraday;
    userData.canViewPricesPage = !userData.isPaClient;
    userData.canViewOptions = userData.isAssetManager || userData.isTrader || userData.isActive || userData.isIntraday;
    userData.canViewCfd = userData.isTrader || userData.isActive || userData.isIntraday;
    userData.canViewFutures = userData.canViewCfd;
    userData.canViewLeveragedProducts = !userData.isCustodyClient && !userData.isCustodyPensionClient;
    userData.canViewCertificates = userData.canViewLeveragedProducts;
    userData.canViewWarrants = !userData.isCustodyClient && !userData.isCustodyPensionClient;
    userData.isCombinationOrderAvailable = userData.canViewOptions;
    const sourceNames = [
        'address',
        'firstContact',
        'secondContact',
        'bankAccount'
    ];
    sourceNames.forEach((sourceName) => {
        const sourceData = clientInfo[sourceName];
        if (!sourceData) {
            return;
        }
        userData[sourceName] = {};
        Object.entries(sourceData).forEach(([key, value]) => {
            userData[sourceName][key] = typeof value === 'string' ? unescape(value) : value;
        });
    });
    return userData;
}
//# sourceMappingURL=prepare-client-data.js.map