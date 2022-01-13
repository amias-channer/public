import {Country} from 'frontend-core/dist/models/country';
import {I18n} from 'frontend-core/dist/models/i18n';
import {User} from 'frontend-core/dist/models/user';
import getAllCountries from 'frontend-core/dist/services/country/get-all-countries';
import {Config} from '../../models/config';
import getResidenciesIds from './get-residencies-ids';

export default function getAllowedResidencies(config: Config, client: User, i18n: I18n): Promise<Country[]> {
    return Promise.all([getResidenciesIds(config), getAllCountries(client, i18n)]).then(
        ([residences, countries]: [string[], Country[]]) => {
            const residenceCountries: Country[] = [];

            countries.forEach((country) => {
                if (residences.includes(country.id)) {
                    residenceCountries.push(country);
                }
            });
            return residenceCountries;
        }
    );
}
