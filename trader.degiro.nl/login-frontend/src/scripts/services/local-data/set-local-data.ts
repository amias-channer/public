import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {DeviceInfo} from 'frontend-core/dist/platform/get-device-info';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import * as localStorage from 'frontend-core/dist/platform/localstorage';
import * as nativeStorage from 'frontend-core/dist/platform/nativestorage';
import {storageKey} from '../../models/local-data';
import {User} from '../../models/user';
import getLocalUserData from './get-local-user-data';

export default function setLocalData(user: User, users: User[], deviceInfo: Partial<DeviceInfo>): Promise<void> {
    if (!isWebViewApp()) {
        return Promise.resolve();
    }

    const storeLocalData: Record<string, object> = {
        deviceInfo,
        user: getLocalUserData(user),
        users: users.map(getLocalUserData)
    };

    // remove old data from the LocalStorage, because we will use only NativeStorage
    localStorage.removeItem(storageKey);

    return nativeStorage.setItem(storageKey, storeLocalData).catch((error: Error) => {
        // use LocalStorage as a backup for NativeStorage
        localStorage.setItem(storageKey, storeLocalData);
        logErrorLocally(error);
    });
}
