import {TotalPortfolioData} from 'frontend-core/dist/models/total-portfolio';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import formatNumber from 'frontend-core/dist/utils/number/format-number';
import {Config} from 'frontend-core/dist/models/config';
import {User} from 'frontend-core/dist/models/user';
import getCountryTimezone from 'frontend-core/dist/utils/date/get-country-timezone';

type Values = Pick<TotalPortfolioData, 'marginReport' | 'marginCallDeadline' | 'marginCallStatus'>;

interface Options {
    marginCallValue: string | undefined;
    // ISO-8601 date (UTC timezone)
    marginCallDeadline: string | undefined;
    [key: string]: string | undefined;
}

export default function getMarginCallStatusI18nOptions(config: Config, currentClient: User, values: Values): Options {
    const baseCurrencySymbol: string = getCurrencySymbol(config.baseCurrency);
    const {marginReport, marginCallDeadline} = values;
    const {culture: clientCountry} = currentClient;

    return {
        marginCallValue:
            marginReport == null
                ? undefined
                : `${baseCurrencySymbol} ${formatNumber(marginReport, {...config, preset: 'amount'})}`,
        // Use always 'nl-NL' locale to get a fixed format DD-MM-YYYY which is the most common across our app and to
        // get a fixed format of timezone names, "WEST/CEST" instead of GMT+.
        marginCallDeadline:
            marginCallDeadline &&
            clientCountry &&
            new Intl.DateTimeFormat('nl-NL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: getCountryTimezone(clientCountry),
                timeZoneName: 'short'
            }).format(new Date(marginCallDeadline))
    };
}
