import {getItem} from 'frontend-core/dist/platform/localstorage';
import {InboxSettings, storageKey} from '../../models/inbox';

/**
 * @todo Move this fn to Worker thread to Alerts resource
 * @returns {InboxSettings}
 */
export default function getInboxSettings(): InboxSettings {
    const settings: InboxSettings | undefined = getItem(storageKey);
    const readMessages = settings && settings.readMessages;

    return {
        ...settings,
        readMessages: Array.isArray(readMessages) ? readMessages : []
    };
}
