import {CombinationOrderData, PriceConditionIds} from 'frontend-core/dist/models/combination-order';
import {OrderConfirmation, OrderData, OrderFreeSpaceData, OrderType} from 'frontend-core/dist/models/order';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {label, line, valueItem} from '../../../../styles/details-overview.css';
import subscribeOnOrderFreeSpace, {
    OrderFreeSpaceManagerProps
} from '../../../services/order/subscribe-on-order-free-space';
import {ConfigContext, CurrentClientContext, EventBrokerContext, I18nContext} from '../../app-component/app-context';
import PanelSection from '../../app-component/side-information-panel/section';
import {nbsp} from '../../value';
import Amount from '../../value/amount';

interface Props {
    productInfo: ProductInfo;
    orderConfirmation: OrderConfirmation;
    combinationOrderData?: CombinationOrderData;
    orderType?: OrderType;
    isBuyAction?: boolean;
    orderData?: OrderData;
}

const {useState, useEffect, useContext} = React;
const OrderConfirmationFreeSpace: React.FunctionComponent<Props> = ({
    productInfo,
    combinationOrderData,
    orderData,
    isBuyAction,
    orderType,
    orderConfirmation
}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const currentClient = useContext(CurrentClientContext);
    const {baseCurrency} = config;
    const [orderFreeSpaceData, setOrderFreeSpaceData] = useState<OrderFreeSpaceData | undefined>();

    useEffect(() => {
        let props: OrderFreeSpaceManagerProps | undefined;

        if (combinationOrderData && baseCurrency) {
            props = {
                eventBroker,
                orderConfirmation,
                baseCurrency,
                currentClient,
                productInfo,
                isBuyAction: combinationOrderData.strategy.payReceive === PriceConditionIds.PAY,
                orderData: combinationOrderData
            };
        } else if (orderType && orderData && baseCurrency) {
            props = {
                eventBroker,
                orderConfirmation,
                baseCurrency,
                currentClient,
                productInfo,
                isBuyAction,
                orderData,
                orderType
            };
        }

        setOrderFreeSpaceData(undefined);

        return props && subscribeOnOrderFreeSpace(props, setOrderFreeSpaceData);
    }, [
        baseCurrency,
        productInfo,
        currentClient,
        orderConfirmation,
        combinationOrderData,
        orderType,
        orderData,
        isBuyAction
    ]);

    if (!orderFreeSpaceData) {
        return null;
    }

    const baseCurrencySymbolPrefix: string = `${getCurrencySymbol(baseCurrency)}${nbsp}`;

    return (
        <PanelSection header={localize(i18n, 'trader.orderConfirmation.marginImpact')}>
            <div className={line}>
                {localize(
                    i18n,
                    currentClient.isIntraday
                        ? 'trader.orderConfirmation.freeSpace.title.intraday'
                        : 'trader.orderConfirmation.freeSpace.title.regular'
                )}
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.orderConfirmation.freeSpace.current')}</div>
                <Amount
                    id="orderConfirmation"
                    field="freeSpaceCurrent"
                    className={valueItem}
                    prefix={baseCurrencySymbolPrefix}
                    value={orderFreeSpaceData.freeSpaceCurrent}
                />
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.orderConfirmation.freeSpace.new')}</div>
                <Amount
                    id="orderConfirmation"
                    field="freeSpaceNew"
                    className={valueItem}
                    prefix={baseCurrencySymbolPrefix}
                    value={orderFreeSpaceData.freeSpaceNew}
                />
            </div>
        </PanelSection>
    );
};

export default React.memo(OrderConfirmationFreeSpace);
