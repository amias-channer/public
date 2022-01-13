import {disabledIcon, secondaryActionIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {Order} from 'frontend-core/dist/models/order';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {CommonOrderEvents} from '../../event-broker/event-types';
import {EventBrokerContext, I18nContext} from '../app-component/app-context';
import {disabledButton, textButton} from '../button/button.css';

interface Props {
    order: Order;
    className?: string;
}

const {useContext} = React;
const OrderEditButton: React.FunctionComponent<Props> = ({order, className = ''}) => {
    const i18n = useContext(I18nContext);
    const eventBroker = useContext(EventBrokerContext);
    const onClick = () => eventBroker.emit(CommonOrderEvents.EDIT, order);
    const title: string = localize(i18n, 'trader.openOrders.orderEditForm.title');
    const isDisabled: boolean = !order.isModifiable;

    return (
        <button
            type="button"
            title={isDisabled ? undefined : title}
            aria-label={title}
            className={`${textButton} ${isDisabled ? disabledButton : ''} ${className}`}
            data-name="orderEditButton"
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}>
            <Icon type="edit_outline" className={isDisabled ? disabledIcon : secondaryActionIcon} />
        </button>
    );
};

export default React.memo(OrderEditButton);
