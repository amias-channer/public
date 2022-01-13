import * as React from 'react';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import localize from 'frontend-core/dist/services/i18n/localize';
import accountTypeIconUrl from '../../images/svg/account-type.svg';
import bankAccountsIconUrl from '../../images/svg/bank-cards.svg';
import onlineFormsIconUrl from '../../images/svg/online-forms.svg';
import personInfoIconUrl from '../../images/svg/person-info.svg';
import personalSettingsIconUrl from '../../images/svg/personal-settings.svg';
import taxInfoIconUrl from '../../images/svg/tax-info.svg';
import {CurrentClientContext, I18nContext} from '../components/app-component/app-context';
import {ProfileItem, ProfileItemIds} from '../models/profile';
import useOpenedClientTasksCount from './use-opened-client-tasks-count';

const {useContext, useMemo} = React;

export default function useProfileItems(): ProfileItem[] {
    const {clientRoleTranslation, isCustodyClient, secondContact} = useContext(CurrentClientContext);
    const {value: tasksCount} = useOpenedClientTasksCount();
    const i18n = useContext(I18nContext);

    return useMemo(() => {
        const dirtyItems: Array<ProfileItem | undefined> = [
            {
                id: ProfileItemIds.PERSONAL_INFORMATION,
                to: Routes.PERSONAL_INFORMATION,
                iconUrl: personInfoIconUrl,
                title: localize(i18n, 'trader.profile.personalInformation.title'),
                subTitle: localize(i18n, 'trader.profile.personalInformation.subTitle')
            },
            {
                id: ProfileItemIds.TRADING_PROFILE,
                disabled: isCustodyClient,
                to: Routes.TRADING_PROFILE,
                iconUrl: accountTypeIconUrl,
                title: localize(i18n, 'trader.profile.tradingProfile.title'),
                subTitle: localize(i18n, 'trader.profile.tradingProfile.subTitle'),
                meta: clientRoleTranslation ? localize(i18n, clientRoleTranslation) : undefined
            },
            {
                id: ProfileItemIds.PERSONAL_SETTINGS,
                to: Routes.PERSONAL_SETTINGS,
                iconUrl: personalSettingsIconUrl,
                title: localize(i18n, 'trader.profile.personalSettings.title'),
                subTitle: localize(i18n, 'trader.profile.personalSettings.subTitle')
            },
            secondContact && {
                id: ProfileItemIds.JOINT_ACCOUNT_INFORMATION,
                to: Routes.JOINT_ACCOUNT_INFORMATION,
                iconUrl: personInfoIconUrl,
                title: localize(i18n, 'trader.profile.jointAccountInformation.title'),
                subTitle: localize(i18n, 'trader.profile.jointAccountInformation.subTitle')
            },
            {
                id: ProfileItemIds.BANK_ACCOUNTS,
                to: Routes.BANK_ACCOUNTS,
                iconUrl: bankAccountsIconUrl,
                title: localize(i18n, 'trader.bankAccounts.title'),
                subTitle: localize(i18n, 'trader.bankAccounts.subTitle')
            },
            {
                id: ProfileItemIds.TAX_INFORMATION,
                to: Routes.TAX_INFORMATION,
                iconUrl: taxInfoIconUrl,
                title: localize(i18n, 'trader.taxInformation.title'),
                subTitle: localize(i18n, 'trader.taxInformation.subTitle')
            },
            {
                id: ProfileItemIds.ONLINE_FORMS,
                to: Routes.ONLINE_FORMS,
                iconUrl: onlineFormsIconUrl,
                badge: tasksCount > 0 ? tasksCount : undefined,
                title: localize(i18n, 'trader.onlineForms.title'),
                subTitle: localize(i18n, 'trader.onlineForms.subTitle')
            }
        ];

        return dirtyItems.filter((item): item is ProfileItem => Boolean(item));
    }, [i18n, clientRoleTranslation, isCustodyClient, secondContact, tasksCount]);
}
