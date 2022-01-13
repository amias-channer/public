import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import placeOrderIconUrl from '../../../../images/svg/place-order.svg';
import {CommonOrderEvents, CombinationOrderEvents, CurrencyOrderEvents} from '../../../event-broker/event-types';
import {EventBrokerContext, I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import BlockMenu, {BlockMenuProps} from '../../menu/block-menu';
import BlockMenuItemLayout from '../../menu/block-menu/block-menu-item-layout';
import {button} from './place-order-menu.css';

const {memo, useCallback, useContext} = React;
const PlaceOrderMenu: React.FunctionComponent = () => {
    const eventBroker = useContext(EventBrokerContext);
    const i18n = useContext(I18nContext);
    const buttonLabel = localize(i18n, 'trader.orderForm.addOrderButton');
    const combinationOrderLabel = localize(i18n, 'trader.combinationOrder.title');
    const currencyOrderLabel = localize(i18n, 'trader.currencyOrder.title');
    const handlePlaceOrderClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        () => eventBroker.emit(CommonOrderEvents.OPEN, {}),
        []
    );
    const handleCombinationOrderClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        () => eventBroker.emit(CombinationOrderEvents.OPEN),
        []
    );
    const handleCurrencyOrderClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        () => eventBroker.emit(CurrencyOrderEvents.OPEN),
        []
    );
    const renderTarget = useCallback<BlockMenuProps['renderTarget']>(
        ({isOpened, open, close}) => (
            <Button
                aria-label={buttonLabel}
                data-name="placeOrderMenuButton"
                className={button}
                variant={ButtonVariants.ACCENT}
                onClick={handlePlaceOrderClick}
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
                        <button aria-label={buttonLabel} type="button" onClick={handlePlaceOrderClick}>
                            <BlockMenuItemLayout
                                iconUrl={placeOrderIconUrl}
                                title={buttonLabel}
                                description={localize(i18n, 'trader.orderForm.addOrderButton.description')}
                            />
                        </button>
                    </li>
                    <li>
                        <button aria-label={combinationOrderLabel} type="button" onClick={handleCombinationOrderClick}>
                            <BlockMenuItemLayout
                                preserveIconSpace={true}
                                title={combinationOrderLabel}
                                description={localize(i18n, 'trader.combinationOrder.description')}
                            />
                        </button>
                    </li>
                    <li>
                        <button aria-label={currencyOrderLabel} type="button" onClick={handleCurrencyOrderClick}>
                            <BlockMenuItemLayout
                                preserveIconSpace={true}
                                title={currencyOrderLabel}
                                description={localize(i18n, 'trader.currencyOrder.menuDescription')}
                            />
                        </button>
                    </li>
                </ul>
            </nav>
        </BlockMenu>
    );
};

export default memo(PlaceOrderMenu);
