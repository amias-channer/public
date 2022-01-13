import localize from 'frontend-core/dist/services/i18n/localize';
import {Location} from 'history';
import * as React from 'react';
import {Routes} from '../../navigation';
import isOrdersLinkActive from '../../services/router/is-orders-link-active';
import {I18nContext} from '../app-component/app-context';
import Alerts from '../inbox/alerts/index';
import SubNavigation from '../navigation/sub-navigation/index';
import SubNavigationLink from '../navigation/sub-navigation/sub-navigation-link';
import OpenedTasksAlert from '../profile/online-forms/opened-tasks-alert/index';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';

const {useContext, memo} = React;
const isOpenOrdersLinkActive = (_: unknown, location: Location) => isOrdersLinkActive(location);
const AccountActivityNavigation = memo(() => {
    const i18n = useContext(I18nContext);
    const compact = useGlobalFullLayoutFlag();

    return (
        <>
            <SubNavigation compact={compact}>
                <SubNavigationLink isActive={isOpenOrdersLinkActive} to={Routes.OPEN_ORDERS}>
                    {localize(i18n, 'trader.navigation.orders')}
                </SubNavigationLink>
                <SubNavigationLink to={Routes.TRANSACTIONS}>
                    {localize(i18n, 'trader.navigation.transactions')}
                </SubNavigationLink>
                <SubNavigationLink to={Routes.ACCOUNT_OVERVIEW}>
                    {localize(i18n, 'trader.navigation.accountOverview')}
                </SubNavigationLink>
                <SubNavigationLink to={Routes.REPORTS}>{localize(i18n, 'trader.navigation.reports')}</SubNavigationLink>
                <SubNavigationLink to={Routes.PORTFOLIO_DEPRECIATION}>
                    {localize(i18n, 'trader.navigation.portfolioDepreciation')}
                </SubNavigationLink>
            </SubNavigation>
            <OpenedTasksAlert />
            <Alerts />
        </>
    );
});

AccountActivityNavigation.displayName = 'AccountActivityNavigation';
export default AccountActivityNavigation;
