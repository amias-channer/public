import {Config} from 'frontend-core/dist/models/config';
import {CurrencySettings} from 'frontend-core/dist/models/currency';
import getCurrencySettings from 'frontend-core/dist/services/currency/get-currency-settings';

export default function getCurrenciesToSell(config: Config): Promise<CurrencySettings[]> {
    return getCurrencySettings(config, {addBaseCurrency: true}).then((currencySettings: CurrencySettings[]) => {
        return currencySettings.filter((currencySettings: CurrencySettings) => {
            // select base currency and all manual fx currencies
            return currencySettings.isBaseCurrency || !currencySettings.enabled;
        });
    });
}
