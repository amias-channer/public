import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {CommonOrderEvents} from '../../event-broker/event-types';
import {CommonOrderInfo} from '../../models/order';
import isTradableProduct from '../../services/product/is-tradable-product';
import {EventBrokerContext, I18nContext} from '../app-component/app-context';
import {buyButton, sellButton, smallButtonLayout, largeButtonLayout} from './product-trading-buttons.css';

export interface ProductTradingButtonsProps {
    productInfo: ProductInfo;
    fullText?: boolean;
    className?: string;
    buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    buyButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    sellButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    orderInfo?: CommonOrderInfo;
    isBuyAvailable?: boolean;
    isSellAvailable?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
const {useCallback, useContext, forwardRef} = React;
const ProductTradingButtons = forwardRef<HTMLDivElement, ProductTradingButtonsProps>(
    (
        {
            productInfo,
            fullText,
            className = '',
            buttonProps = {},
            buyButtonProps = {},
            sellButtonProps = {},
            orderInfo,
            isBuyAvailable = true,
            isSellAvailable = true,
            onClick
        },
        rootElRef
    ) => {
        const i18n = useContext(I18nContext);
        const eventBroker = useContext(EventBrokerContext);
        const onBuyButtonClick = useCallback(
            () => eventBroker.emit(CommonOrderEvents.OPEN, {...orderInfo, isBuyAction: true, productInfo}),
            [orderInfo, productInfo, eventBroker]
        );
        const onSellButtonClick = useCallback(
            () => eventBroker.emit(CommonOrderEvents.OPEN, {...orderInfo, isBuyAction: false, productInfo}),
            [orderInfo, productInfo, eventBroker]
        );
        const isTradable: boolean = isTradableProduct(productInfo);
        const {className: buttonClassName = '', ...restButtonProps} = buttonProps;
        const {className: buyButtonClassName = '', ...restBuyButtonProps} = buyButtonProps;
        const {className: sellButtonClassName = '', ...restSellButtonProps} = sellButtonProps;

        if (!productInfo || (!isBuyAvailable && !isSellAvailable)) {
            return null;
        }

        return (
            <div
                ref={rootElRef}
                className={`${fullText ? largeButtonLayout : smallButtonLayout} ${className}`}
                onClick={onClick}
                key={String(productInfo.id)}>
                {isBuyAvailable && (
                    <button
                        type="button"
                        className={`${buyButton} ${buttonClassName} ${buyButtonClassName}`}
                        data-action="buy"
                        disabled={!isTradable}
                        onClick={onBuyButtonClick}
                        title={localize(i18n, 'trader.productActions.buy')}
                        {...restButtonProps}
                        {...restBuyButtonProps}>
                        {localize(i18n, fullText ? 'trader.productActions.buy' : 'trader.productActions.buy.short')}
                    </button>
                )}
                {isSellAvailable && (
                    <button
                        type="button"
                        className={`${sellButton} ${buttonClassName} ${sellButtonClassName}`}
                        data-action="sell"
                        disabled={!isTradable}
                        onClick={onSellButtonClick}
                        title={localize(i18n, 'trader.productActions.sell')}
                        {...restButtonProps}
                        {...restSellButtonProps}>
                        {localize(i18n, fullText ? 'trader.productActions.sell' : 'trader.productActions.sell.short')}
                    </button>
                )}
            </div>
        );
    }
);

ProductTradingButtons.displayName = 'ProductTradingButtons';
export default ProductTradingButtons;
