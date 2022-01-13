import {User} from 'frontend-core/dist/models/user';
import {getItem} from 'frontend-core/dist/platform/localstorage';
import {availableNewsLanguages, NewsLanguage, NewsSettings, storageKey} from '../../models/news';

export default function getNewsSettings(currentClient: User): NewsSettings {
    const defaultLanguage: NewsLanguage | undefined = availableNewsLanguages.find(
        (language: NewsLanguage) => language.code === currentClient.language
    );
    const defaultLanguageCode: string = defaultLanguage?.code || 'en';
    const {enabledLanguageCodes = [defaultLanguageCode]} = getItem(storageKey) || {};

    return {defaultLanguageCode, enabledLanguageCodes};
}
