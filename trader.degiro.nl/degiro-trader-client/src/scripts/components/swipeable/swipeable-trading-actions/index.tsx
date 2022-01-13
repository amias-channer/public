import {ProductInfo} from 'frontend-core/dist/models/product';
import * as React from 'react';
import ProductTradingButtons from '../../product-trading-buttons';
import {actions, actionWrapper, action, buyAction, sellAction} from './swipeable-trading-actions.css';

export interface SwipeableTradingActionsProps {
    onAction?: () => void;
    productInfo: ProductInfo;
}

const {memo} = React;
const buttonProps = {className: action, tabIndex: -1};
const buyButtonProps = {className: buyAction};
const sellButtonProps = {className: sellAction};
const SwipeableTradingActions: React.FunctionComponent<SwipeableTradingActionsProps> = ({onAction, productInfo}) => (
    <div className={actions}>
        <ProductTradingButtons
            className={actionWrapper}
            buttonProps={buttonProps}
            buyButtonProps={buyButtonProps}
            sellButtonProps={sellButtonProps}
            onClick={onAction}
            productInfo={productInfo}
        />
    </div>
);

export default memo(SwipeableTradingActions);
