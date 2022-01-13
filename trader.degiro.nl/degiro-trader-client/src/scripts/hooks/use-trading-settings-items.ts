import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import useAsync from 'frontend-core/dist/hooks/use-async';
import localize from 'frontend-core/dist/services/i18n/localize';
import isIexSubscriptionEnabled from 'frontend-core/dist/services/iex/is-iex-subscription-enabled';
import {useContext, useMemo} from 'react';
import allocationIconUrl from '../../images/svg/allocation.svg';
import currencyIconUrl from '../../images/svg/currency.svg';
import notificationsIconUrl from '../../images/svg/notifications.svg';
import realTimeIconUrl from '../../images/svg/real-time.svg';
import settingsIconUrl from '../../images/svg/settings.svg';
import simpleCategoryIconUrl from '../../images/svg/simple-category.svg';
import {ConfigContext, CurrentClientContext, I18nContext} from '../components/app-component/app-context';
import {TradingSettingsIds, TradingSettingsItem} from '../models/trading-settings';
import isUsSubscriptionAvailable from '../services/us-subscription/is-us-subscription-available';

export default function useTradingSettingsItems(): TradingSettingsItem[] {
    const config = useContext(ConfigContext);
    const {areCurrencySettingsAvailable, isAllocationAvailable} = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const {value: hasIexSubscription = false} = useAsync(() => isIexSubscriptionEnabled(config), [config]);

    return useMemo(() => {
        const dirtyItems: (false | undefined | TradingSettingsItem)[] = [
            {
                id: TradingSettingsIds.PRODUCT_GOVERNANCE_SETTINGS,
                to: Routes.PRODUCT_GOVERNANCE_SETTINGS,
                iconUrl: settingsIconUrl,
                label: localize(i18n, 'trader.productGovernance.title'),
                description: localize(i18n, 'trader.productGovernance.menuDescription')
            },
            areCurrencySettingsAvailable && {
                id: TradingSettingsIds.CURRENCY,
                to: Routes.CURRENCY_SETTINGS,
                iconUrl: currencyIconUrl,
                label: localize(i18n, 'trader.navigation.settings.currency'),
                description: localize(i18n, 'trader.navigation.settings.currency.description')
            },
            {
                id: TradingSettingsIds.REAL_TIME_PRICES,
                to: Routes.REAL_TIME_PRICES_SETTINGS,
                iconUrl: realTimeIconUrl,
                label: localize(i18n, 'trader.navigation.settings.realTimePrices'),
                description: localize(i18n, 'trader.navigation.settings.realTimePrices.description')
            },
            isUsSubscriptionAvailable() && {
                id: TradingSettingsIds.US_SUBSCRIPTION,
                to: Routes.US_SUBSCRIPTION_SETTINGS,
                iconUrl: simpleCategoryIconUrl,
                label: localize(i18n, 'trader.navigation.settings.usSubscription'),
                description: localize(i18n, 'trader.navigation.settings.usSubscription.description')
            },
            {
                id: TradingSettingsIds.NOTIFICATIONS,
                to: Routes.NOTIFICATIONS_SETTINGS,
                iconUrl: notificationsIconUrl,
                label: localize(i18n, 'trader.navigation.settings.notifications'),
                description: localize(i18n, 'trader.navigation.settings.notifications.description')
            },
            isAllocationAvailable && {
                id: TradingSettingsIds.ALLOCATION,
                to: Routes.ALLOCATION_SETTINGS,
                iconUrl: allocationIconUrl,
                label: localize(i18n, 'trader.navigation.settings.allocation'),
                description: localize(i18n, 'trader.navigation.settings.allocation.description')
            },
            hasIexSubscription && {
                id: TradingSettingsIds.DATA_SHARING,
                to: Routes.DATA_SHARING_SETTINGS,
                label: localize(i18n, 'trader.navigation.settings.dataSharing')
            }
        ];

        return dirtyItems.filter((item): item is TradingSettingsItem => Boolean(item));
    }, [i18n, areCurrencySettingsAvailable, isAllocationAvailable, hasIexSubscription]);
}
