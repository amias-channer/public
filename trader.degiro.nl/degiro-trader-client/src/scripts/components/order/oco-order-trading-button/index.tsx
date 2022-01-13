import {OrderTypeIds, OrderTypeNames} from 'frontend-core/dist/models/order';
import {Position, ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import useProductPosition from '../../../hooks/use-product-position';
import {CommonOrderInfo} from '../../../models/order';
import {I18nContext} from '../../app-component/app-context';
import {nbsp} from '../../value';
import OcoOrderHintButton from '../oco-order-hint-button';
import {hintButton, layout} from './oco-order-trading-button.css';

interface Props {
    productInfo: ProductInfo;
    className?: string;
    onTradingAction(orderInfo: CommonOrderInfo & {isBuyAction: boolean}): void;
}

const {useContext} = React;
const OcoOrderTradingButton: React.FunctionComponent<Props> = ({productInfo, onTradingAction, className = ''}) => {
    const i18n = useContext(I18nContext);
    const position: Position | undefined = useProductPosition(productInfo);
    const positionSize: number = position?.size || 0;
    // [TRADER-174] allow OCO BUY order only for "short" positions
    const isBuyAvailable = positionSize < 0 && (productInfo.buyOrderTypes || []).includes(OrderTypeNames.OCO);
    // [TRADER-174] allow OCO SELL order only for "long" positions
    const isSellAvailable = positionSize > 0 && (productInfo.sellOrderTypes || []).includes(OrderTypeNames.OCO);

    if (!isBuyAvailable && !isSellAvailable) {
        return null;
    }

    const orderInfo = {isBuyAction: isBuyAvailable, orderTypeId: OrderTypeIds.OCO, productInfo};

    return (
        <div className={`${layout} ${className}`}>
            <button type="button" data-name="ocoOrderButton" onClick={onTradingAction.bind(null, orderInfo)}>
                {localize(i18n, isBuyAvailable ? 'trader.productActions.buy' : 'trader.productActions.sell')}
                {`${nbsp}–${nbsp}`}
                {localize(i18n, 'order.type.oco')}
            </button>
            <OcoOrderHintButton className={hintButton} />
        </div>
    );
};

export default React.memo<Props>(OcoOrderTradingButton);
