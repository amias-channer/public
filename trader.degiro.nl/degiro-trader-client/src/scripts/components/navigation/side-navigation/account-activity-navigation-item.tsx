import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Routes} from '../../../navigation';
import isActivityLinkActive from '../../../services/router/is-activity-link-active';
import {I18nContext} from '../../app-component/app-context';
import BlockMenu, {BlockMenuProps} from '../../menu/block-menu';
import BlockMenuItemLayout from '../../menu/block-menu/block-menu-item-layout';
import BlockMenuTitle from '../../menu/block-menu/block-menu-title';
import {
    activeNavigationItem,
    navigationItem,
    navigationItemIcon,
    navigationItemTitle,
    navigationItemToggleIcon,
    openedNavigationItem
} from './side-navigation.css';

const {useCallback, useContext, useMemo} = React;
const AccountActivityNavigationItem: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const isActive: boolean = useMemo(() => isActivityLinkActive(location), [location]);
    const title = localize(i18n, 'trader.navigation.activity');
    const renderTarget = useCallback<BlockMenuProps['renderTarget']>(
        ({isOpened, open, close}) => (
            <Link
                to={Routes.OPEN_ORDERS}
                data-name="accountActivityMenuItem"
                data-active={isActive}
                className={`${navigationItem} ${isActive ? activeNavigationItem : ''} ${
                    isOpened ? openedNavigationItem : ''
                }`}
                onClick={deactivateActiveElement}
                onFocus={open}
                onMouseLeave={close}
                onMouseOver={open}>
                <Icon className={navigationItemIcon} type={isActive ? 'schedule' : 'schedule_outline'} />
                <span className={navigationItemTitle}>{title}</span>
                <Icon className={navigationItemToggleIcon} type="arrow_drop_down" />
            </Link>
        ),
        [isActive, title]
    );

    return (
        <BlockMenu renderTarget={renderTarget} verticalPosition="inside-start" height="full-viewport">
            <BlockMenuTitle>{title}</BlockMenuTitle>
            <nav aria-label={title}>
                <ul role="menu">
                    <li role="menuitem">
                        <Link to={Routes.OPEN_ORDERS}>
                            <BlockMenuItemLayout
                                title={localize(i18n, 'trader.navigation.orders')}
                                description={localize(i18n, 'trader.navigation.orders.description')}
                            />
                        </Link>
                    </li>
                    <li role="menuitem">
                        <Link to={Routes.TRANSACTIONS}>
                            <BlockMenuItemLayout
                                title={localize(i18n, 'trader.navigation.transactions')}
                                description={localize(i18n, 'trader.navigation.transactions.description')}
                            />
                        </Link>
                    </li>
                    <li role="menuitem">
                        <Link to={Routes.ACCOUNT_OVERVIEW}>
                            <BlockMenuItemLayout
                                title={localize(i18n, 'trader.navigation.accountOverview')}
                                description={localize(i18n, 'trader.navigation.accountOverview.description')}
                            />
                        </Link>
                    </li>
                    <li role="menuitem">
                        <Link to={Routes.PORTFOLIO_DEPRECIATION}>
                            <BlockMenuItemLayout
                                title={localize(i18n, 'trader.navigation.portfolioDepreciation')}
                                description={localize(i18n, 'trader.navigation.portfolioDepreciation.description')}
                            />
                        </Link>
                    </li>
                    <li role="menuitem">
                        <Link to={Routes.REPORTS}>
                            <BlockMenuItemLayout
                                title={localize(i18n, 'trader.navigation.reports')}
                                description={localize(i18n, 'trader.navigation.reports.description')}
                            />
                        </Link>
                    </li>
                </ul>
            </nav>
        </BlockMenu>
    );
};

export default React.memo(AccountActivityNavigationItem);
