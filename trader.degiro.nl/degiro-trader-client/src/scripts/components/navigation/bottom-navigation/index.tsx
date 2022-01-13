import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {CommonOrderEvents} from '../../../event-broker/event-types';
import {Routes} from '../../../navigation';
import isActivityLinkActive from '../../../services/router/is-activity-link-active';
import isFavouriteProductsLinkActive from '../../../services/router/is-favourite-products-link-active';
import isMarketsLinkActive from '../../../services/router/is-markets-link-active';
import isPortfolioLinkActive from '../../../services/router/is-portfolio-link-active';
import {EventBrokerContext, I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import ClosedVisualKeyboard from '../../closed-visual-keyboard/index';
import {
    activeNavigationItem,
    navigation,
    navigationItem,
    navigationItemIcon,
    navigationItemsList,
    orderButton,
    orderButtonIcon
} from './bottom-navigation.css';

interface Props {
    className: string;
}

const {useCallback, useContext} = React;
const BottomNavigation: React.FunctionComponent<Props> = ({className}) => {
    const i18n = useContext(I18nContext);
    const eventBroker = useContext(EventBrokerContext);
    const location = useLocation();
    const openCommonOrder = useCallback(() => eventBroker.emit(CommonOrderEvents.OPEN, {}), []);
    const isMarketsItemActive = isMarketsLinkActive(location);
    const isFavouritesItemActive = isFavouriteProductsLinkActive(location);
    const isPortfolioItemActive = isPortfolioLinkActive(location);
    const isActivityItemActive = isActivityLinkActive(location);

    return (
        <ClosedVisualKeyboard>
            <div className={`${navigation} ${className}`} data-name="bottomNavigation">
                <nav className={navigationItemsList}>
                    <NavLink
                        className={`${navigationItem} ${isMarketsItemActive ? activeNavigationItem : ''}`}
                        to={Routes.MARKETS}>
                        <Icon
                            className={navigationItemIcon}
                            type={isMarketsItemActive ? 'show_chart' : 'show_chart_outline'}
                        />
                        {localize(i18n, 'trader.navigation.markets')}
                    </NavLink>
                    <NavLink
                        className={`${navigationItem} ${isFavouritesItemActive ? activeNavigationItem : ''}`}
                        to={Routes.FAVOURITE_PRODUCTS}>
                        <Icon className={navigationItemIcon} type={isFavouritesItemActive ? 'star' : 'star_outline'} />
                        {localize(i18n, 'trader.navigation.favourites')}
                    </NavLink>
                    <Button
                        variant={ButtonVariants.ACCENT}
                        className={`
                            ${orderButton}
                            ${navigationItem} 
                            ${isFavouritesItemActive ? activeNavigationItem : ''}
                        `}
                        onClick={openCommonOrder}
                        aria-label={localize(i18n, 'trader.orderForm.addOrderButton')}
                        data-name="quickOrderButton">
                        <Icon className={orderButtonIcon} type="add" />
                    </Button>
                    <NavLink
                        className={`${navigationItem} ${isPortfolioItemActive ? activeNavigationItem : ''}`}
                        to={Routes.PORTFOLIO}>
                        <Icon
                            className={navigationItemIcon}
                            type={isPortfolioItemActive ? 'account_balance_wallet' : 'account_balance_wallet_outline'}
                        />
                        {localize(i18n, 'trader.navigation.portfolio')}
                    </NavLink>
                    <NavLink
                        className={`${navigationItem} ${isActivityItemActive ? activeNavigationItem : ''}`}
                        data-name="accountActivityMenuItem"
                        to={Routes.OPEN_ORDERS}>
                        <Icon
                            className={navigationItemIcon}
                            type={isActivityItemActive ? 'schedule' : 'schedule_outline'}
                        />
                        {localize(i18n, 'trader.navigation.activity')}
                    </NavLink>
                </nav>
            </div>
        </ClosedVisualKeyboard>
    );
};

export default React.memo(BottomNavigation);
