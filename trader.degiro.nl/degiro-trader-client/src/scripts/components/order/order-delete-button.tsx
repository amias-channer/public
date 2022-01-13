import {disabledIcon, secondaryActionIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {Order} from 'frontend-core/dist/models/order';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {CommonOrderEvents} from '../../event-broker/event-types';
import getProductName from '../../services/product/get-product-name';
import {EventBrokerContext, I18nContext, MainClientContext} from '../app-component/app-context';
import {disabledButton, textButton} from '../button/button.css';

interface Props {
    order: Order;
    className?: string;
}

const {useContext} = React;
const OrderDeleteButton: React.FunctionComponent<Props> = ({order, className = ''}) => {
    const i18n = useContext(I18nContext);
    const eventBroker = useContext(EventBrokerContext);
    const mainClient = useContext(MainClientContext);
    const onClick = () => eventBroker.emit(CommonOrderEvents.DELETE, order);
    const {productInfo} = order;
    const productName: string = (productInfo && getProductName(mainClient, productInfo)) || '';
    const title: string = localize(i18n, 'trader.openOrders.deleteOrderConfirmation.title', {productName});
    const isDisabled: boolean = !order.isDeletable;

    return (
        <button
            type="button"
            className={`${textButton} ${isDisabled ? disabledButton : ''} ${className}`}
            title={isDisabled ? undefined : title}
            aria-label={title}
            data-name="orderDeleteButton"
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}>
            <Icon type="delete_outline" className={isDisabled ? disabledIcon : secondaryActionIcon} />
        </button>
    );
};

export default React.memo(OrderDeleteButton);
