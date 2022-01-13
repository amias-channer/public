import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import depositIconUrl from '../../../../images/svg/deposit.svg';
import withdrawIconUrl from '../../../../images/svg/withdraw.svg';
import {CashOrderEvents} from '../../../event-broker/event-types';
import {CashOrderTypeIds} from '../../../models/cash-order';
import {EventBrokerContext, I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import BlockMenu, {BlockMenuProps} from '../../menu/block-menu';
import BlockMenuItemLayout from '../../menu/block-menu/block-menu-item-layout';
import {button} from './cash-order-menu.css';

const {memo, useCallback, useContext} = React;
const CashOrderMenu: React.FunctionComponent = () => {
    const eventBroker = useContext(EventBrokerContext);
    const i18n = useContext(I18nContext);
    const buttonLabel = localize(i18n, 'trader.cashOrder.title');
    const depositLabel = localize(i18n, 'trader.cashOrder.orderTypeDeposit');
    const withdrawLabel = localize(i18n, 'trader.cashOrder.orderTypeWithdrawal');
    const handleDepositClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        () => eventBroker.emit(CashOrderEvents.OPEN, {}),
        []
    );
    const handleWithdrawClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        () => eventBroker.emit(CashOrderEvents.OPEN, {orderTypeId: CashOrderTypeIds.WITHDRAWAL}),
        []
    );
    const renderTarget = useCallback<BlockMenuProps['renderTarget']>(
        ({isOpened, open, close}) => (
            <Button
                aria-label={buttonLabel}
                data-name="cashOrderMenuButton"
                className={button}
                variant={ButtonVariants.OUTLINED}
                onClick={handleDepositClick}
                onFocus={open}
                onMouseLeave={close}
                onMouseOver={open}>
                {buttonLabel}
                <Icon flipped={isOpened} type="keyboard_arrow_down" />
            </Button>
        ),
        [buttonLabel]
    );

    return (
        <BlockMenu horizontalPosition="inside-start" renderTarget={renderTarget}>
            <nav aria-label={buttonLabel}>
                <ul>
                    <li>
                        <button aria-label={depositLabel} type="button" onClick={handleDepositClick}>
                            <BlockMenuItemLayout
                                iconUrl={depositIconUrl}
                                title={depositLabel}
                                description={localize(i18n, 'trader.cashOrder.orderTypeDeposit.description')}
                            />
                        </button>
                    </li>
                    <li>
                        <button aria-label={withdrawLabel} type="button" onClick={handleWithdrawClick}>
                            <BlockMenuItemLayout
                                iconUrl={withdrawIconUrl}
                                title={withdrawLabel}
                                description={localize(i18n, 'trader.cashOrder.orderTypeWithdrawal.description')}
                            />
                        </button>
                    </li>
                </ul>
            </nav>
        </BlockMenu>
    );
};

export default memo(CashOrderMenu);
