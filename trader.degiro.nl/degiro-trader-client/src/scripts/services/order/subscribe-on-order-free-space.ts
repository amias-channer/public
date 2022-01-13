import {
    OrderConfirmation,
    OrderData,
    OrderFreeSpaceData,
    OrderType,
    OrderTypeIds
} from 'frontend-core/dist/models/order';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {TotalPortfolioData} from 'frontend-core/dist/models/total-portfolio';
import {User} from 'frontend-core/dist/models/user';
import getTotalOrderValue from 'frontend-core/dist/services/order/get-total-order-value';
import {TotalPortfolioCostType, TotalPortfolioCostTypeField} from 'frontend-core/dist/services/total-portfolio';
import getTotalPortfolioCostTypes from 'frontend-core/dist/services/total-portfolio/get-total-portfolio-cost-types';
import getTotalPortfolioFieldByCostType from 'frontend-core/dist/services/total-portfolio/get-total-portfolio-field-by-cost-type';
import {multiply} from 'frontend-core/dist/utils/decimal';
import {EventBroker} from '../../event-broker';
import {CurrencyExchangeEvents, TotalPortfolioEvents} from '../../event-broker/event-types';
import {CurrencyExchangeParams} from '../../event-broker/resources/currency-exchange';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../../event-broker/subscription';

// [WF-760] server always sends freeSpace values in EUR
const freeSpaceCurrency: string = 'EUR';

export interface OrderFreeSpaceManagerProps {
    eventBroker: EventBroker;
    currentClient: User;
    orderConfirmation: OrderConfirmation;
    orderData: OrderData;
    productInfo: ProductInfo;
    isBuyAction?: boolean;
    orderType?: OrderType;
    baseCurrency: string;
}

export default function subscribeOnOrderFreeSpace(
    props: OrderFreeSpaceManagerProps,
    onUpdate: (data?: OrderFreeSpaceData) => void
): Unsubscribe {
    let isUnsubscribed: boolean = false;
    const {
        currentClient,
        orderType,
        eventBroker,
        orderConfirmation: {freeSpaceNew},
        orderData,
        productInfo,
        isBuyAction,
        baseCurrency
    } = props;
    // [WF-782]
    const shouldUseOrderValueAmount: boolean =
        isBuyAction === true &&
        orderType?.id === OrderTypeIds.LIMIT &&
        currentClient.accountInfo?.marginType === 'SPENDING_LIMIT';

    if (!shouldUseOrderValueAmount && freeSpaceNew === undefined) {
        // empty response, we don't have any data, return noop callback
        onUpdate();
        return () => undefined;
    }

    let totalOrderValue: number | undefined;
    let lastFreeSpaceExchangeRate: number | undefined;
    let lastProductExchangeRate: number | undefined;
    let lastTotalPortfolioData: Partial<TotalPortfolioData> = {};
    const unsubscribeHandlers: Unsubscribe[] = [];
    const costTypes: TotalPortfolioCostType[] = getTotalPortfolioCostTypes({
        ...currentClient,
        // exclude overnight report
        hasOvernightReport: false
    });
    const costTypeField: TotalPortfolioCostTypeField = getTotalPortfolioFieldByCostType(costTypes[0]);
    const calculateFreeSpace = () => {
        const freeSpaceCurrent: number | null | undefined = lastTotalPortfolioData[costTypeField];

        if (freeSpaceCurrent == null) {
            return;
        }

        if (shouldUseOrderValueAmount) {
            if (!lastProductExchangeRate) {
                return;
            }

            return onUpdate({
                freeSpaceCurrent,
                freeSpaceNew: freeSpaceCurrent - multiply(totalOrderValue, lastProductExchangeRate)
            });
        }

        if (!lastFreeSpaceExchangeRate) {
            return;
        }

        onUpdate({
            freeSpaceCurrent,
            freeSpaceNew: multiply(freeSpaceNew, lastFreeSpaceExchangeRate)
        });
    };

    if (freeSpaceCurrency === baseCurrency) {
        lastFreeSpaceExchangeRate = 1;
    } else {
        const currencyExchangeParams: CurrencyExchangeParams = {
            fromCurrency: freeSpaceCurrency,
            toCurrency: baseCurrency
        };
        const onCurrencyExchangeUpdate = (_e: SubscriptionEvent, rate: number | null) => {
            if (isUnsubscribed || !rate) {
                return;
            }

            lastFreeSpaceExchangeRate = rate;
            calculateFreeSpace();
        };

        unsubscribeHandlers.push(
            eventBroker.once(
                CurrencyExchangeEvents.LAST_EXCHANGE_RATE,
                currencyExchangeParams,
                onCurrencyExchangeUpdate
            ),
            eventBroker.on(CurrencyExchangeEvents.CHANGE, currencyExchangeParams, onCurrencyExchangeUpdate)
        );
    }

    if (shouldUseOrderValueAmount) {
        totalOrderValue = getTotalOrderValue(orderData, productInfo);

        if (productInfo.currency === baseCurrency) {
            lastProductExchangeRate = 1;
        } else {
            const currencyExchangeParams: CurrencyExchangeParams = {
                fromCurrency: productInfo.currency,
                toCurrency: baseCurrency
            };
            const onCurrencyExchangeUpdate = (_e: SubscriptionEvent, rate: number | null) => {
                if (isUnsubscribed || !rate) {
                    return;
                }

                lastProductExchangeRate = rate;
                calculateFreeSpace();
            };

            unsubscribeHandlers.push(
                eventBroker.once(
                    CurrencyExchangeEvents.LAST_EXCHANGE_RATE,
                    currencyExchangeParams,
                    onCurrencyExchangeUpdate
                ),
                eventBroker.on(CurrencyExchangeEvents.CHANGE, currencyExchangeParams, onCurrencyExchangeUpdate)
            );
        }
    }

    const onTotalPortfolio = (_event: SubscriptionEvent, totalPortfolioData: TotalPortfolioData) => {
        lastTotalPortfolioData = totalPortfolioData;
        calculateFreeSpace();
    };

    unsubscribeHandlers.push(
        eventBroker.once(TotalPortfolioEvents.LAST_DATA, onTotalPortfolio),
        eventBroker.on(TotalPortfolioEvents.CHANGE, onTotalPortfolio)
    );

    return function unsubscribeFromOrderFreeSpace() {
        isUnsubscribed = true;
        unsubscribeAll(unsubscribeHandlers);
    };
}
