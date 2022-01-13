import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {useHistory, useLocation} from 'react-router-dom';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import useTradingSettingsItems from '../../hooks/use-trading-settings-items';
import {TradingSettingsIds, TradingSettingsItem} from '../../models/trading-settings';
import {Routes} from '../../navigation';
import isProductGovernanceSettingsLinkActive from '../../services/router/is-product-governance-settings-link-active';
import isUsSubscriptionAvailable from '../../services/us-subscription/is-us-subscription-available';
import {I18nContext} from '../app-component/app-context';
import Alerts from '../inbox/alerts/index';
import SubNavigation from '../navigation/sub-navigation/index';
import SubNavigationLink from '../navigation/sub-navigation/sub-navigation-link';
import {navigationItemBadge} from '../navigation/sub-navigation/sub-navigation.css';
import Page from '../page/index';
import PageWrapper from '../page/page-wrapper';
import OpenedTasksAlert from '../profile/online-forms/opened-tasks-alert/index';
import HeaderNavigationButton from '../header/compact-header/header-navigation-button';
import {pageContent} from './settings.css';

const {useContext} = React;
const AllocationSettings = createLazyComponent(
    () => import(/* webpackChunkName: "allocation-settings" */ './allocation-settings')
);
const CurrencySettings = createLazyComponent(
    () => import(/* webpackChunkName: "currency-settings" */ './currency-settings')
);
const DataSharingSettings = createLazyComponent(
    () => import(/* webpackChunkName: "data-sharing-settings" */ './data-sharing-settings')
);
const NotificationSettings = createLazyComponent(
    () => import(/* webpackChunkName: "notifications-settings" */ './notifications-settings')
);
const ProductGovernanceSettings = createLazyComponent(
    () => import(/* webpackChunkName: "product-governance-settings" */ './product-governance-settings')
);
const RealTimePricesSettings = createLazyComponent(
    () => import(/* webpackChunkName: "real-time-prices-settings" */ './real-time-prices-settings')
);
const SettingsStartPage = createLazyComponent(
    () => import(/* webpackChunkName: "settings-start-page" */ './start-page')
);
const UsSubscriptionSettings = createLazyComponent(
    () => import(/* webpackChunkName: "us-subscription-settings" */ './us-subscription-settings')
);
const Settings: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const history = useHistory();
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const tradingSettingsItems: TradingSettingsItem[] = useTradingSettingsItems();
    const hasCurrencySettings: boolean = tradingSettingsItems.some((item: TradingSettingsItem) => {
        return item.id === TradingSettingsIds.CURRENCY;
    });
    const isProductGovernanceSettings: boolean = isProductGovernanceSettingsLinkActive(location);
    const isSettingsStartPage: boolean = location.pathname === Routes.SETTINGS;

    useDocumentTitle(localize(i18n, 'trader.navigation.settings'));

    return (
        <PageWrapper data-name="settings">
            {hasGlobalFullLayout && (
                <SubNavigation compact={hasGlobalFullLayout}>
                    {tradingSettingsItems.map(({id, to, label}) => (
                        <SubNavigationLink key={id} to={to}>
                            {label}
                            {id === TradingSettingsIds.US_SUBSCRIPTION && (
                                <span key={`${id}-badge`} className={navigationItemBadge}>
                                    {localize(i18n, 'trader.newFeatureBadge')}
                                </span>
                            )}
                        </SubNavigationLink>
                    ))}
                </SubNavigation>
            )}
            <OpenedTasksAlert />
            <Alerts />
            {!isSettingsStartPage && <HeaderNavigationButton onClick={history.goBack} />}
            <Page>
                <div className={isProductGovernanceSettings || isSettingsStartPage ? undefined : pageContent}>
                    <Switch>
                        {hasCurrencySettings && (
                            <Route key={TradingSettingsIds.CURRENCY} exact={true} path={Routes.CURRENCY_SETTINGS}>
                                {() => <CurrencySettings />}
                            </Route>
                        )}
                        <Route
                            key={TradingSettingsIds.PRODUCT_GOVERNANCE_SETTINGS}
                            exact={true}
                            path={Routes.PRODUCT_GOVERNANCE_SETTINGS}>
                            {() => <ProductGovernanceSettings />}
                        </Route>
                        <Route
                            key={TradingSettingsIds.REAL_TIME_PRICES}
                            exact={true}
                            path={Routes.REAL_TIME_PRICES_SETTINGS}>
                            {() => <RealTimePricesSettings />}
                        </Route>
                        {isUsSubscriptionAvailable() && (
                            <Route
                                key={TradingSettingsIds.US_SUBSCRIPTION}
                                exact={true}
                                path={Routes.US_SUBSCRIPTION_SETTINGS}>
                                {() => <UsSubscriptionSettings />}
                            </Route>
                        )}
                        <Route key={TradingSettingsIds.NOTIFICATIONS} exact={true} path={Routes.NOTIFICATIONS_SETTINGS}>
                            {() => <NotificationSettings />}
                        </Route>
                        <Route key={TradingSettingsIds.ALLOCATION} exact={true} path={Routes.ALLOCATION_SETTINGS}>
                            {() => <AllocationSettings />}
                        </Route>
                        <Route key={TradingSettingsIds.DATA_SHARING} exact={true} path={Routes.DATA_SHARING_SETTINGS}>
                            {() => <DataSharingSettings />}
                        </Route>
                        {!hasGlobalFullLayout && (
                            <Route key="settings" exact={true} path={Routes.SETTINGS}>
                                {() => <SettingsStartPage />}
                            </Route>
                        )}
                        <Redirect
                            from="*"
                            to={hasGlobalFullLayout ? Routes.PRODUCT_GOVERNANCE_SETTINGS : Routes.SETTINGS}
                        />
                    </Switch>
                </div>
            </Page>
        </PageWrapper>
    );
};

export default React.memo(Settings);
