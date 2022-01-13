import {SelectValue} from 'frontend-core/dist/components/ui-trader3/select';
import * as React from 'react';
import {Country} from 'frontend-core/dist/models/country';
import localize from 'frontend-core/dist/services/i18n/localize';
import {I18nContext, CountriesContext, MainClientContext} from '../../app-component/app-context';

const {useContext, useMemo} = React;

export default function useCountryValues(customCountries?: Country[]): SelectValue[] {
    const defaultCountries = useContext(CountriesContext);
    const {culture} = useContext(MainClientContext);
    const countries = customCountries || defaultCountries;
    const i18n = useContext(I18nContext);

    return useMemo(() => {
        // [CLM-2681] Culture country should appear first in list
        const mainClientCountry: Country | undefined = countries.find((country: Country) => country.id === culture);
        const allCountries: Country[] = mainClientCountry
            ? [mainClientCountry, ...countries.filter((country: Country) => country !== mainClientCountry)]
            : countries;

        return [
            {
                id: '',
                label: localize(i18n, 'taskManager.task.taskForm.countrySelect')
            },
            ...allCountries
        ];
    }, [countries, i18n, culture]);
}
