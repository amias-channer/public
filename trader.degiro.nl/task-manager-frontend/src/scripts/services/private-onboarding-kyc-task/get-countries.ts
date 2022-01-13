import {Country} from 'frontend-core/dist/models/country';
import {I18n} from 'frontend-core/dist/models/i18n';
import {User} from 'frontend-core/dist/models/user';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import createLocaleComparator from 'frontend-core/dist/utils/collection/create-locale-comparator';
import {Config} from '../../models/config';

export default function getCountries(config: Config, i18n: I18n, client: User): Promise<Country[]> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/eligible-id-documents/countries`
    })
        .then((countriesIds: string[]) => {
            return countriesIds.map(
                (id: string): Country => {
                    const translationKey = `dictionary.country.${id}`;

                    return {
                        id,
                        label: i18n[translationKey] || ''
                    };
                }
            );
        })
        .then((countries: Country[]) =>
            countries.sort(createLocaleComparator(client.locale, (country: Country) => country.label))
        );
}
