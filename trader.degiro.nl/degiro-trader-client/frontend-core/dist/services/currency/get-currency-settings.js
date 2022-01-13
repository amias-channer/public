import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default async function getCurrencySettings(config, params) {
    const { baseCurrency } = config;
    const response = await requestToApi({
        config,
        url: `${config.tradingUrl}settings/fx${getPathCredentials(config)}`,
        method: 'GET'
    });
    const result = [...response];
    if ((params === null || params === void 0 ? void 0 : params.addBaseCurrency) && baseCurrency) {
        let baseCurrencySettings = result.find((currencySettings) => {
            return currencySettings.currency === baseCurrency;
        });
        if (!baseCurrencySettings) {
            baseCurrencySettings = {
                enabled: true,
                currency: baseCurrency
            };
            result.unshift(baseCurrencySettings);
        }
        baseCurrencySettings.isBaseCurrency = true;
    }
    return result;
}
//# sourceMappingURL=get-currency-settings.js.map