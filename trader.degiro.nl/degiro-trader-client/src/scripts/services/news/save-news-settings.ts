import {setItem} from 'frontend-core/dist/platform/localstorage';
import {NewsSettings, storageKey} from '../../models/news';

export default function saveNewsSettings(settings: Omit<NewsSettings, 'defaultLanguageCode'>): void {
    setItem(storageKey, settings);
}
