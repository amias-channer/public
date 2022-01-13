import {Config} from 'frontend-core/dist/models/config';
import {DictionaryCountry} from 'frontend-core/dist/models/country';
import {I18n} from 'frontend-core/dist/models/i18n';
import {StockCountry} from 'frontend-core/dist/models/stock';
import {User} from 'frontend-core/dist/models/user';
import getDictionaryCountries from 'frontend-core/dist/services/country/get-dictionary-countries';
import getStockCountries from 'frontend-core/dist/services/products/stock/get-stock-countries';
import getDictionaryRegions from 'frontend-core/dist/services/region/get-dictionary-regions';
import keyBy from 'frontend-core/dist/utils/key-by';
import omitNullable from 'frontend-core/dist/utils/omit-nullable';
import {StocksNavigation} from '../../../models/stock';

const europeRegionId = 1;
const otherRegionId = 3;
const mostTradedCountries: string[] = ['US', 'GB', 'DE', 'NL'];

export default async function getStocksNavigation(
    config: Config,
    currentClient: User,
    i18n: I18n
): Promise<StocksNavigation> {
    const {settings, culture} = currentClient;
    const [countries, stockCountries, regions] = await Promise.all([
        getDictionaryCountries(config, currentClient, i18n),
        getStockCountries(config, currentClient, i18n),
        getDictionaryRegions(config)
    ]);
    const countriesById: Record<string, DictionaryCountry> = keyBy<DictionaryCountry>(countries);
    const defaultStockCountry: StockCountry | undefined =
        stockCountries.find((country: StockCountry) => country.id === settings?.defaultStockCountryId) ||
        stockCountries.find((country: StockCountry) => country.name === culture);
    const topCountries: StockCountry[] = omitNullable<StockCountry>([
        defaultStockCountry,
        ...mostTradedCountries
            .filter((countryCode: string) => countryCode !== defaultStockCountry?.name)
            .map((countryCode: string) => stockCountries.find((country) => country.name === countryCode))
    ]).slice(0, 4);

    return {
        topCountries,
        regionalCountries: regions
            .filter(({id}) => id === europeRegionId || id === otherRegionId)
            .map((region) => ({
                region,
                countries: stockCountries.filter(({id}) => {
                    const countryRegionId: number | undefined = countriesById[id]?.region;

                    // "Europe" region should contain only related countries, while "Other" contains the rest
                    return (
                        (region.id === europeRegionId && countryRegionId === europeRegionId) ||
                        (region.id !== europeRegionId && countryRegionId !== europeRegionId)
                    );
                })
            }))
    };
}
