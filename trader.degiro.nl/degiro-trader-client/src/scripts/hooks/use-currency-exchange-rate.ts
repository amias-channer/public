import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {CurrencyExchangeEvents} from '../event-broker/event-types';
import {CurrencyExchangeParams} from '../event-broker/resources/currency-exchange';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../event-broker/subscription';

type State = number | undefined;

export default function useCurrencyExchangeRate(
    fromCurrency: string | undefined,
    toCurrency: string | undefined
): Readonly<State> {
    const eventBroker = useContext(EventBrokerContext);
    const [exchangeRate, setExchangeRate] = useState<State>(undefined);

    useEffect(() => {
        // reset previous value
        setExchangeRate(undefined);

        if (!fromCurrency || !toCurrency) {
            return;
        }

        const onChange = (_event: SubscriptionEvent, rate: number | null) => {
            setExchangeRate(rate == null ? undefined : rate);
        };
        const params: CurrencyExchangeParams = {fromCurrency, toCurrency};
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.once(CurrencyExchangeEvents.LAST_EXCHANGE_RATE, params, onChange),
            eventBroker.on(CurrencyExchangeEvents.CHANGE, params, onChange)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, [fromCurrency, toCurrency]);

    return exchangeRate;
}
