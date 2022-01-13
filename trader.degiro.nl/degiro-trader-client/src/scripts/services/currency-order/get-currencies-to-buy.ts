import {Config} from 'frontend-core/dist/models/config';
import {CurrencyPairProduct, CurrencySettings} from 'frontend-core/dist/models/currency';
import {EventBroker} from '../../event-broker';
import {CurrencyExchangeEvents} from '../../event-broker/event-types';
import {SubscriptionEvent} from '../../event-broker/subscription';
import getCurrenciesToSell from './get-currencies-to-sell';

export default function getCurrenciesToBuy(
    config: Config,
    eventBroker: EventBroker,
    params: {currencyToSell: string}
): Promise<CurrencySettings[]> {
    const {baseCurrency = ''} = config;
    const {currencyToSell} = params;

    return getCurrenciesToSell(config).then((currencySettings: CurrencySettings[]) => {
        const currenciesToBuy: CurrencySettings[] = [];
        const queue: Array<void | Promise<void>> = currencySettings.map((currencySettings: CurrencySettings) => {
            const {currency} = currencySettings;

            // "buy" and "sell" currency can't be the same
            if (currency === currencyToSell) {
                return;
            }

            // if we selected not a baseCurrency as "sell" currency we should return only a baseCurrency in list
            if (currencyToSell !== baseCurrency) {
                if (currency === baseCurrency) {
                    currenciesToBuy.push(currencySettings);
                }
                return;
            }

            return new Promise<void>((resolve) => {
                eventBroker.once(
                    CurrencyExchangeEvents.CURRENCY_PAIR_PRODUCT,
                    {fromCurrency: currencyToSell, toCurrency: currency},
                    (_event: SubscriptionEvent, pairProduct: CurrencyPairProduct | undefined) => {
                        if (pairProduct) {
                            currenciesToBuy.push(currencySettings);
                        }
                        resolve();
                    }
                );
            });
        });

        return Promise.all(queue).then(() => currenciesToBuy);
    });
}
