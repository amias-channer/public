import {DeviceInfo} from 'frontend-core/dist/platform/get-device-info';
import {User} from './user';

export const storageKey: string = 'DEGIROApp/dgLoginStore';

export interface UserLocalData {
    username: User['username'];
    locale: User['locale'];
    deviceId: User['deviceId'];
}

export interface LocalData {
    deviceInfo?: Partial<DeviceInfo>;
    user?: UserLocalData;
    users?: UserLocalData[];
}
