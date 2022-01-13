import {setItem} from 'frontend-core/dist/platform/localstorage';
import {InboxSettings, storageKey} from '../../models/inbox';

/**
 * @todo Move this fn to Worker thread to Alerts resource
 * @param {InboxSettings} settings
 * @returns {void}
 */
export default function saveInboxSettings(settings: InboxSettings): void {
    setItem(storageKey, settings);
}
