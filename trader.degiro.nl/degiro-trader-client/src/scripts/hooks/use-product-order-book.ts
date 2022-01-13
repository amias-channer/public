import {OrderBook} from 'frontend-core/dist/models/order-book';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {OrderBookEvents} from '../event-broker/event-types';
import isTradableProduct from '../services/product/is-tradable-product';

const xetraExchangeId = '194';

export default function useProductOrderBook(productInfo: ProductInfo): OrderBook | undefined {
    const {vwdId, exchangeId} = productInfo;
    const eventBroker = useContext(EventBrokerContext);
    const [orderBook, setOrderBook] = useState<OrderBook | undefined>();

    useEffect(() => {
        // * we are not allowed to get ordersBookItems book for Xetra, only the latest Bid/Ask can be used (Chi-x)
        // * product should be tradable
        // * product should have valid VWD id
        if (vwdId == null || String(exchangeId) === xetraExchangeId || !isTradableProduct(productInfo)) {
            setOrderBook(undefined);
            return;
        }

        return eventBroker.on(OrderBookEvents.CHANGE, {vwdId}, (_, orderBook: OrderBook) => setOrderBook(orderBook));
    }, [vwdId]);

    return orderBook;
}
