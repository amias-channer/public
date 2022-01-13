import {LocaleData} from 'frontend-core/dist/models/i18n';
import getI18nLocale from 'frontend-core/dist/services/i18n/get-i18n-locale';
import {getLocaleData} from 'frontend-core/dist/services/i18n/site-locale';

const assetManagerCodePattern: RegExp = /\/am\/([^/]+)/i;

export default function getUrlParams(location: Location): {amCode: string | undefined; locale: string | undefined} {
    const {pathname} = location;
    let amCode: string | undefined = (assetManagerCodePattern.exec(pathname) || [])[1];
    let locale: string | undefined;

    // support old-style URL '/login/nl/login/{amCode}'
    if (!amCode) {
        amCode = pathname.split('/login/')[2];
    }

    // support old-style URL '/login/login/{amCode}'
    if (!amCode) {
        amCode = pathname.split('/login/login/')[1];
    }

    pathname.split('/').some((localeParam: string) => {
        const localeData: LocaleData | undefined = getLocaleData(localeParam);

        if (localeData) {
            locale = getI18nLocale(localeData);
            return true;
        }

        return false;
    });

    return {
        amCode,
        locale
    };
}
