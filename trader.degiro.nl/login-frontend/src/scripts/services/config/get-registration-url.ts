import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import {Config} from '../../models/config';

export default function getRegistrationUrl(config: Config, i18n: I18n): string {
    const {amCode} = config;
    // remove a site locale: uk, nl, benl, fr, befr, etc.
    const registrationUrl = localize(i18n, 'url.degiro.registration')
        // /registration/uk/ => /registration
        // /registration/uk => /registration
        // /registration/ => /registration
        // /registration => /registration
        .replace(/\/[a-z]{0,4}\/?$/, '');

    return `${registrationUrl}${amCode ? `/registration/access/${amCode}` : ''}`;
}
