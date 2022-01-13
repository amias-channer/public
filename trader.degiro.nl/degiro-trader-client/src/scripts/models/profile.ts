export enum ProfileItemIds {
    BANK_ACCOUNTS = 'BANK_ACCOUNTS',
    JOINT_ACCOUNT_INFORMATION = 'JOINT_ACCOUNT_INFORMATION',
    ONLINE_FORMS = 'ONLINE_FORMS',
    PERSONAL_INFORMATION = 'PERSONAL_INFORMATION',
    PERSONAL_SETTINGS = 'PERSONAL_SETTINGS',
    TAX_INFORMATION = 'TAX_INFORMATION',
    TRADING_PROFILE = 'TRADING_PROFILE'
}

export interface ProfileItem {
    id: ProfileItemIds;
    disabled?: boolean;
    to: string;
    iconUrl: string;
    badge?: number;
    title: string;
    subTitle: string;
    meta?: string;
}
