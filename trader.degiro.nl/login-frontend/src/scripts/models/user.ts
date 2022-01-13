import {AppParams} from './app-params';

export interface User {
    username?: string;
    passCode?: string;
    password?: string;
    redirectUrl?: string;
    sessionId?: string;
    locale?: string;
    deviceId?: string;
    personId?: number;
    isPassCodeEnabled?: boolean;
}

export type PasswordLoginResponse = Required<Pick<User, 'isPassCodeEnabled' | 'locale' | 'redirectUrl' | 'sessionId'>>;
export type PassCodeLoginResponse = PasswordLoginResponse;

export interface PassCodeLoginParams {
    username: string;
    passCode: string;
    queryParams: AppParams;
    isBiometricLogin: boolean;
    // we need to send deviceId always
    deviceId: string | undefined;
    // optional params
    personId?: number;
}

export interface PassCodeResetParams {
    passCode: string;
}

export interface PasswordLoginParams {
    username: string;
    password: string;
    queryParams: AppParams;
    // we need to send deviceId always
    deviceId: string | undefined;
    // optional params
    personId?: number;
    isPassCodeEnabled?: boolean;
}

export interface PasswordResetData {
    username: string;
    email: string;
}

export interface PasswordResetConfirmationData {
    newPassword: string;
    newPasswordConfirmation: string;
}

export const passCodeLength = 5;
export const passCodePattern: RegExp = new RegExp(`^[0-9]{${passCodeLength}}$`);
