// http://charting.vwdservices.com/hchart/documentation/javascript
import {User} from 'frontend-core/dist/models/user';
import {VwdApiOptions} from '../../models/vwd-api';

const apiLocales: string[] = ['en', 'nl', 'fr', 'en-GB', 'en-US', 'nl-NL', 'nl-BE', 'fr-FR', 'fr-BE', 'fr-CH'];

export default function getVwdApiOptions(mainClient: User): VwdApiOptions {
    const locale: string = (mainClient.locale || '').replace('_', '-');
    const apiLocale: string = apiLocales.indexOf(locale) >= 0 ? locale : apiLocales[0];

    return {
        userToken: String(mainClient.id),
        timezone: mainClient.timezone,
        locale: apiLocale
    };
}
