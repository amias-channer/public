import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {CashOrderEvents} from '../../event-broker/event-types';
import {CashOrderInfo} from '../../models/cash-order';
import {EventBrokerContext, I18nContext} from '../app-component/app-context';
import {ButtonVariants, getButtonClassName} from '../button';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    orderInfo?: CashOrderInfo;
}

const {useContext} = React;
const defaultClassName = getButtonClassName({variant: ButtonVariants.ACCENT});
const CashOrderButton: React.FunctionComponent<Props> = ({orderInfo = {}, children, onClick, ...buttonProps}) => {
    const eventBroker = useContext(EventBrokerContext);
    const i18n = useContext(I18nContext);
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        eventBroker.emit(CashOrderEvents.OPEN, orderInfo);
        onClick?.(event);
    };

    return (
        <button
            type="button"
            data-name="cashOrderButton"
            className={defaultClassName}
            {...buttonProps}
            onClick={handleClick}>
            {children || localize(i18n, 'trader.cashOrder.title')}
        </button>
    );
};

export default React.memo<React.PropsWithChildren<Props>>(CashOrderButton);
