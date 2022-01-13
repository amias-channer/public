import {OrderActionTypes} from 'frontend-core/dist/models/order';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {buyBadge, sellBadge} from './buy-sell-badge.css';

export interface BuySellBadgeProps {
    isBuyAction: boolean;
    shortFormat?: boolean;
    className?: string;
}

const {useContext} = React;
const BuySellBadge: React.FunctionComponent<BuySellBadgeProps> = ({
    isBuyAction,
    shortFormat,
    children,
    className = ''
}) => {
    const i18n = useContext(I18nContext);
    let badgeClassName: string;
    let translation: string;
    let actionType: OrderActionTypes;

    if (isBuyAction) {
        actionType = OrderActionTypes.BUY;
        badgeClassName = buyBadge;
        translation = shortFormat ? 'trader.productActions.buy.short' : 'trader.productActions.buy';
    } else {
        actionType = OrderActionTypes.SELL;
        badgeClassName = sellBadge;
        translation = shortFormat ? 'trader.productActions.sell.short' : 'trader.productActions.sell';
    }

    return (
        <span data-name="buySellBadge" data-action={actionType} className={`${badgeClassName} ${className}`}>
            {localize(i18n, translation)}
            {children}
        </span>
    );
};

export default React.memo<React.PropsWithChildren<BuySellBadgeProps>>(BuySellBadge);
