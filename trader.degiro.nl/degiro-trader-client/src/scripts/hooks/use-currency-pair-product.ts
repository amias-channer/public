import {CurrencyPairProduct} from 'frontend-core/dist/models/currency';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {CurrencyExchangeEvents} from '../event-broker/event-types';
import {CurrencyExchangeParams} from '../event-broker/resources/currency-exchange';
import {SubscriptionEvent} from '../event-broker/subscription';

type State = CurrencyPairProduct | undefined;

export default function useCurrencyPairProduct(
    fromCurrency: string | undefined,
    toCurrency: string | undefined
): Readonly<State> {
    const eventBroker = useContext(EventBrokerContext);
    const [currencyPairProduct, setCurrencyPairProduct] = useState<State>(undefined);

    useEffect(() => {
        // reset previous value
        setCurrencyPairProduct(undefined);

        if (!fromCurrency || !toCurrency) {
            return;
        }

        const onProduct = (_event: SubscriptionEvent, product: CurrencyPairProduct | undefined) => {
            setCurrencyPairProduct(product);
        };
        const params: CurrencyExchangeParams = {fromCurrency, toCurrency};

        return eventBroker.once(CurrencyExchangeEvents.CURRENCY_PAIR_PRODUCT, params, onProduct);
    }, [fromCurrency, toCurrency]);

    return currencyPairProduct;
}
