export interface Config {
    translationsUrl: string;
    loginByPasswordUrl: string;
    loginByPassCodeUrl: string;
    passCodeUrl: string;
    deviceUrl: string;
    otpCheckUrl: string;
    passwordResetUrl: string;
    passwordResetConfirmationUrl: string;
    iexConnectUrl: string;
    iexReturnUrlParamsGenerationUrl: string;
    redirectUnauthorizedToLogin: boolean;
    redirectUsPersonToLogin: boolean;
    locale?: string;
    amCode?: string;
}

export const initialConfig: Readonly<Config> = {
    translationsUrl: '/translations/',
    loginByPasswordUrl: 'secure/login',
    loginByPassCodeUrl: 'secure/login/device',
    otpCheckUrl: 'secure/login/totp',
    passCodeUrl: 'secure/device/passCode',
    deviceUrl: 'secure/device',
    passwordResetUrl: 'secure/resetpassword/request',
    passwordResetConfirmationUrl: 'secure/resetpassword/confirm',
    iexConnectUrl: 'secure/iex/connect',
    iexReturnUrlParamsGenerationUrl: 'secure/iex/generateReturnUrlParams',
    redirectUnauthorizedToLogin: false,
    redirectUsPersonToLogin: false
};
