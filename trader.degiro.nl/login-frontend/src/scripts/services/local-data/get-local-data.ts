import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import * as localStorage from 'frontend-core/dist/platform/localstorage';
import * as nativeStorage from 'frontend-core/dist/platform/nativestorage';
import {LocalData, storageKey} from '../../models/local-data';

export default function getLocalData(): Promise<LocalData | void> {
    if (!isWebViewApp()) {
        return Promise.resolve();
    }

    const localStoreState: LocalData = localStorage.getItem(storageKey);

    // check if we still have the old stored data in LocalStorage
    if (localStoreState && Object.keys(localStoreState).length > 0) {
        return Promise.resolve(localStoreState);
    }

    return nativeStorage.getItem(storageKey) as Promise<LocalData | void>;
}
