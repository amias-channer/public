import {buttonsLine, formButton} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import {CombinationOrderData, PriceConditionIds} from 'frontend-core/dist/models/combination-order';
import {OrderActionTypes, OrderConfirmation, OrderTimeTypeNames} from 'frontend-core/dist/models/order';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {label, line, valueItem} from '../../../../styles/details-overview.css';
import {ConfigContext, I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import BuySellBadge from '../../buy-sell-badge/index';
import {nbsp} from '../../value/index';
import OrderInputPrice from '../../value/order-input-price';
import OrderConfirmationFees from '../order-confirmation/order-confirmation-fees/index';
import OrderConfirmationFreeSpace from '../order-confirmation/order-confirmation-free-space';
import OrderConfirmationMessages from '../order-confirmation/order-confirmation-messages/index';

export interface CombinationOrderConfirmationProps {
    firstProduct: ProductInfo;
    secondProduct: ProductInfo;
    strategyValue: string;
    orderConfirmation: OrderConfirmation;
    orderData: CombinationOrderData;
    onCancel(): void;
    onConfirm(): void;
}

const {useContext} = React;
const CombinationOrderConfirmation: React.FunctionComponent<CombinationOrderConfirmationProps> = ({
    firstProduct,
    secondProduct,
    orderData,
    orderConfirmation,
    strategyValue,
    onConfirm,
    onCancel
}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {strategy} = orderData;
    const [firstStrategyLeg, secondStrategyLeg] = strategy.legs;

    return (
        <div data-name="orderConfirmation">
            <OrderConfirmationMessages orderConfirmation={orderConfirmation} />
            <div className={line}>
                <span className={label}>{localize(i18n, 'trader.combinationOrder.selectedStrategy')}</span>
                <div className={valueItem}>{strategyValue}</div>
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.combinationOrder.leg')} 1</div>
                <div className={valueItem}>
                    <BuySellBadge isBuyAction={firstStrategyLeg.buySell !== OrderActionTypes.SELL} />
                    {` ${firstProduct.name}`}
                </div>
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.combinationOrder.leg')} 2</div>
                <div className={valueItem}>
                    <BuySellBadge isBuyAction={secondStrategyLeg.buySell !== OrderActionTypes.SELL} />
                    {` ${secondProduct.name}`}
                </div>
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.orderForm.quantityField')}</div>
                <div className={valueItem}>
                    <OrderInputPrice id="combinationOrder" field="size" value={orderData.size} />
                </div>
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.orderForm.priceField')}</div>
                <div className={valueItem}>
                    <OrderInputPrice
                        id="combinationOrder"
                        field="price"
                        prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                        value={orderData.price}
                    />
                </div>
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.combinationOrder.priceCondition')}</div>
                <div className={valueItem}>
                    {strategy.payReceive === PriceConditionIds.PAY
                        ? localize(i18n, 'trader.combinationOrder.payAction')
                        : localize(i18n, 'trader.combinationOrder.receiveAction')}
                </div>
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.combinationOrder.timeCondition')}</div>
                <div className={valueItem}>
                    {orderData.orderTimeType === OrderTimeTypeNames.DAY
                        ? localize(i18n, 'order.timeType.date')
                        : localize(i18n, 'order.timeType.gtc')}
                </div>
            </div>
            <OrderConfirmationFees productInfo={firstProduct} orderConfirmation={orderConfirmation} />
            <OrderConfirmationFreeSpace
                orderConfirmation={orderConfirmation}
                combinationOrderData={orderData}
                productInfo={firstProduct}
            />
            <div className={buttonsLine}>
                <Button className={formButton} variant={ButtonVariants.OUTLINED} onClick={onCancel}>
                    {localize(i18n, 'trader.forms.actions.cancel')}
                </Button>
                <Button className={formButton} variant={ButtonVariants.ACCENT} onClick={onConfirm}>
                    {localize(i18n, 'trader.forms.actions.confirm')}
                </Button>
            </div>
        </div>
    );
};

export default React.memo(CombinationOrderConfirmation);
