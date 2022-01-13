import {AppError} from 'frontend-core/dist/models/app-error';
import {Config} from 'frontend-core/dist/models/config';
import {EurexCountryItem} from 'frontend-core/dist/models/country';
import {I18n} from 'frontend-core/dist/models/i18n';
import {
    OptionAggregateValues,
    OptionDerivativeExchange,
    OptionExchange,
    OptionMonth,
    OptionsAggregateType,
    OptionStrikeType,
    OptionStrikeTypeIds,
    OptionType,
    OptionTypeIds,
    OptionUnderlying,
    OptionYear
} from 'frontend-core/dist/models/option';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {User} from 'frontend-core/dist/models/user';
import getMonthName from 'frontend-core/dist/services/date/get-month-name';
import {FilterOption} from 'frontend-core/dist/services/filter';
import getFilterOptionAll from 'frontend-core/dist/services/filter/get-filter-option-all';
import isFilterOptionAll from 'frontend-core/dist/services/filter/is-filter-option-all';
import getOptionAggregateTypes from 'frontend-core/dist/services/products/option/get-option-aggregate-types';
import getOptionAggregateValues from 'frontend-core/dist/services/products/option/get-option-aggregate-values';
import getOptionExchanges from 'frontend-core/dist/services/products/option/get-option-exchanges';
import getOptionStrikeTypes from 'frontend-core/dist/services/products/option/get-option-strike-types';
import getOptionTypes from 'frontend-core/dist/services/products/option/get-option-types';
import getOptionUnderlyings from 'frontend-core/dist/services/products/option/get-option-underlyings';
import {OptionsRequestParams} from 'frontend-core/dist/services/products/option/get-options';
import getFilterOptionById from 'frontend-core/dist/services/products/product/get-filter-option-by-id';
import getProductInfo from 'frontend-core/dist/services/products/product/get-product-info';
import {ProductsRequestParams} from 'frontend-core/dist/services/products/product/get-products';
import prepareProductsSearchRequestParams from 'frontend-core/dist/services/products/product/prepare-products-search-request-params';
import getQuotecastRequestProductInfo from 'frontend-core/dist/services/quotecast/get-quotecast-request-product-info';
import {Location} from 'history';
import {EventBroker} from '../../../event-broker';
import {QuotecastEvents} from '../../../event-broker/event-types';
import {QuotecastUpdate, QuotecastUpdateEvent} from '../../../event-broker/resources/quotecast';
import {Unsubscribe} from '../../../event-broker/subscription';
import getOptionDefaultFilterValues from './get-option-default-filter-values';
import getOptionsSearchRequestParamsFromFilterValues from './get-options-search-request-params-from-filter-values';

type AggregateFilterOption = OptionDerivativeExchange | OptionMonth | OptionYear | FilterOption;
type AggregateFilterValue = string | number | undefined;
type SelectedFilterEntry = [string, AggregateFilterValue];
type FilterOptionsEntry = [keyof OptionsFiltersOptions, AggregateFilterOption[]];
// this type represents a list of options with at least 1 item inside
type NonEmptyFilterOptionsEntry = [keyof OptionsFiltersOptions, [AggregateFilterOption, ...AggregateFilterOption[]]];

export interface OptionsFilters {
    exchange?: string;
    country?: string;
    optionType?: OptionTypeIds;
    month?: string;
    year?: string;
    activeStrikePrice?: number;
    activeStrikeThreshold?: number;
    strikeType?: string;
    underlying?: string;
    searchText?: string;
}

export interface OptionsFiltersOptions extends Pick<OptionAggregateValues, 'month' | 'year'> {
    exchange?: OptionExchange[];
    country?: EurexCountryItem[];
    optionType?: OptionType[];
    strikeType?: OptionStrikeType[];
    underlying?: OptionUnderlying[];
}

export interface OptionsFiltersData {
    filters: OptionsFilters;
    filtersOptions: OptionsFiltersOptions;
}

export interface OptionsFiltersManagerLoadOptions {
    save?: boolean;
}

const prepareFiltersOptions = (filterOptionsEntries: FilterOptionsEntry[], i18n: I18n): NonEmptyFilterOptionsEntry[] =>
    filterOptionsEntries.map(
        ([filterKey, filterOptions]: FilterOptionsEntry): NonEmptyFilterOptionsEntry => [
            filterKey,
            [getFilterOptionAll(i18n), ...filterOptions]
        ]
    );
/**
 * @param {OptionsFilters} rawFilters can contain unprepared values
 *          Example: `{country: "124"}` instead of `{country: {id: 124, name: "Netherlands"}}`
 * @param {NonEmptyFilterOptionsEntry[]} filterOptionsEntries
 * @returns {SelectedFilterEntry[]}
 */
const prepareFiltersValues = (
    rawFilters: OptionsFilters,
    filterOptionsEntries: NonEmptyFilterOptionsEntry[]
): SelectedFilterEntry[] => {
    return filterOptionsEntries.map(([filterKey, filterOptions]) => {
        const stringifiedSelectedFilterValue = String(rawFilters[filterKey]);
        const selectedFilterOption: AggregateFilterOption =
            filterOptions.find((filterOption) => stringifiedSelectedFilterValue === String(filterOption.id)) ||
            filterOptions[0];

        return [filterKey, String(selectedFilterOption.id)];
    });
};

export class OptionsFiltersManager {
    data: OptionsFiltersData;

    constructor(client: User, location: Location) {
        this.data = {
            filters: getOptionDefaultFilterValues(client, location),
            filtersOptions: {}
        };
    }

    private getAggregateValues(params: {
        config: Config;
        i18n: I18n;
        aggregateTypes: OptionsAggregateType[];
        filtersData: OptionsFiltersData;
        loadAggregates(aggregatesParams: ProductsRequestParams): Promise<OptionAggregateValues>;
    }): Promise<OptionsFiltersData> {
        const {aggregateTypes, filtersData, i18n} = params;
        const {filters} = filtersData;
        const aggregatesParams: ProductsRequestParams = prepareProductsSearchRequestParams({
            ...this.getProductsRequestParams(filters),
            // as we load always a fixed list of aggregate types we do not send any input types
            inputAggregateTypes: undefined,
            inputAggregateValues: undefined,
            // [WF-1063], exclude search text from aggregates loading
            searchText: undefined,
            // we load always a fixed list of aggregate type
            // TODO: refactor in future to have dependent filters on the screen
            outputAggregateTypes: aggregateTypes.map((type) => type.id)
        });

        return params.loadAggregates(aggregatesParams).then((filterOptionsMap) => {
            const filterOptionsEntries = Object.entries(filterOptionsMap) as FilterOptionsEntry[];
            const filtersOptions: NonEmptyFilterOptionsEntry[] = prepareFiltersOptions(filterOptionsEntries, i18n);
            const filtersValues: SelectedFilterEntry[] = prepareFiltersValues(filters, filtersOptions);

            Object.assign(filtersData.filtersOptions, Object.fromEntries(filtersOptions));
            Object.assign(filtersData.filters, Object.fromEntries(filtersValues));

            return filtersData;
        });
    }

    getProductsRequestParams(filters: OptionsFilters): OptionsRequestParams {
        return getOptionsSearchRequestParamsFromFilterValues(filters);
    }

    async load(
        config: Config,
        client: User,
        i18n: I18n,
        inputFilters?: OptionsFilters,
        options?: OptionsFiltersManagerLoadOptions
    ): Promise<OptionsFiltersData> {
        const filtersData: OptionsFiltersData = {
            filters: {...this.data.filters, ...inputFilters},
            filtersOptions: {}
        } as OptionsFiltersData;
        const {underlying: underlyingFilterValue} = filtersData.filters;

        if (this.data.filters.underlying !== underlyingFilterValue) {
            delete filtersData.filters.activeStrikePrice;
        }

        const [optionsExchanges, optionsTypes, optionsStrikeTypes, optionsAggregateTypes]: [
            OptionExchange[],
            OptionType[],
            OptionStrikeType[],
            OptionsAggregateType[]
        ] = await Promise.all([
            getOptionExchanges(config, client, i18n),
            getOptionTypes(),
            getOptionStrikeTypes(),
            getOptionAggregateTypes(config)
        ]);
        const optionType: OptionType | undefined = getFilterOptionById<OptionType>(
            filtersData.filters.optionType,
            optionsTypes
        );
        const optionExchange: OptionExchange | undefined = getFilterOptionById(
            filtersData.filters.exchange,
            optionsExchanges
        );
        const optionStrikeType: OptionStrikeType | undefined = getFilterOptionById(
            filtersData.filters.strikeType,
            optionsStrikeTypes
        );
        let eurexCountries: EurexCountryItem[] | undefined;

        if (optionExchange && optionExchange.eurexCountries) {
            eurexCountries = optionExchange.eurexCountries.slice(0);
            eurexCountries.unshift(getFilterOptionAll(i18n));
        }

        const eurexCountry: EurexCountryItem | undefined = getFilterOptionById<EurexCountryItem>(
            filtersData.filters.country,
            eurexCountries
        );

        filtersData.filters.optionType = optionType && (String(optionType.id) as OptionTypeIds);
        filtersData.filters.exchange = optionExchange && String(optionExchange.id);
        filtersData.filters.strikeType = optionStrikeType && String(optionStrikeType.id);
        filtersData.filters.country = eurexCountry && String(eurexCountry.id);
        filtersData.filtersOptions = {
            optionType: optionsTypes,
            strikeType: optionsStrikeTypes,
            exchange: optionsExchanges,
            underlying: [],
            country: eurexCountries
        };

        const optionsUnderlyings: OptionUnderlying[] = await getOptionUnderlyings(config, client, {
            optionExchangeId: Number(filtersData.filters.exchange),
            eurexCountryId: eurexCountry && !isFilterOptionAll(eurexCountry.id) ? Number(eurexCountry.id) : undefined
        });

        filtersData.filtersOptions.underlying = optionsUnderlyings;
        const optionUnderlying: OptionUnderlying | undefined = getFilterOptionById<OptionUnderlying>(
            underlyingFilterValue,
            optionsUnderlyings
        );

        filtersData.filters.underlying = optionUnderlying?.id;

        // `this.getAggregateValues` modifies `filtersData`
        await this.getAggregateValues({
            config,
            i18n,
            aggregateTypes: optionsAggregateTypes,
            filtersData,
            loadAggregates: async (aggregatesParams: OptionsRequestParams): Promise<OptionAggregateValues> => {
                // check if we have required params
                if (!aggregatesParams.underlyingIsin) {
                    const aggregateValues: OptionAggregateValues = Object.create(null);

                    aggregatesParams.outputAggregateTypes?.forEach((filter: string) => {
                        aggregateValues[filter as keyof OptionAggregateValues] = [];
                    });

                    return aggregateValues;
                }

                const {month, year, ...restOriginValues} = await getOptionAggregateValues(config, aggregatesParams);
                const aggregateValues: OptionAggregateValues = restOriginValues;

                // Create an object structure for `month` and `year` filters to make them compatible with the others
                if (month) {
                    aggregateValues.month = month.map((month: number) => ({
                        id: month,
                        name: getMonthName(i18n, month)
                    }));
                }

                if (year) {
                    aggregateValues.year = year.map((year: number) => ({
                        id: year,
                        name: String(year)
                    }));
                }

                return aggregateValues;
            }
        });

        if (options && options.save) {
            this.data = filtersData;
        }

        return filtersData;
    }

    canRequestProducts(filters: OptionsFilters) {
        const requestParams: OptionsRequestParams = this.getProductsRequestParams(filters);

        return Boolean(requestParams.underlyingIsin);
    }

    createUrlParams(filters: OptionsFilters): OptionsFilters {
        // exclude from syncing with URL
        const {activeStrikePrice, activeStrikeThreshold, ...urlParams} = filters;

        return urlParams;
    }

    loadProductsRequestParams(
        config: Config,
        client: User,
        eventBroker: EventBroker,
        filtersData: OptionsFiltersData
    ): Promise<OptionsRequestParams> {
        const {filters, filtersOptions} = filtersData;
        const optionStrikeType: OptionStrikeType | undefined = getFilterOptionById<OptionStrikeType>(
            filters.strikeType,
            filtersOptions.strikeType
        );

        if (
            !optionStrikeType ||
            optionStrikeType.id !== OptionStrikeTypeIds.ACTIVE ||
            // [WF-1488] we should be able to pass active price
            filters.activeStrikePrice != null
        ) {
            return Promise.resolve(this.getProductsRequestParams(filters));
        }

        const optionUnderlying: OptionUnderlying | undefined = getFilterOptionById<OptionUnderlying>(
            filters.underlying,
            filtersOptions.underlying
        );

        if (!optionUnderlying) {
            return Promise.reject(new AppError({text: 'Underlying is not found'}));
        }

        return getProductInfo(config, client, {
            id: String(optionUnderlying.underlyingProductId)
        }).then((underlyingProductInfo: ProductInfo) => {
            const {vwdId} = underlyingProductInfo;

            if (vwdId == null) {
                throw new AppError({text: 'Issue id for underlying is not available'});
            }

            let unsubscribe: Unsubscribe | undefined;

            return Promise.race([
                // wait VWD data max 1 second
                new Promise<undefined>((resolve) => {
                    setTimeout(() => {
                        unsubscribe?.();
                        unsubscribe = undefined;
                        resolve(undefined);
                    }, 1000);
                }),
                new Promise<number>((resolve) => {
                    unsubscribe = eventBroker.on(
                        QuotecastEvents.CHANGE,
                        {
                            products: [getQuotecastRequestProductInfo(underlyingProductInfo)],
                            fields: ['LastPrice']
                        },
                        (_event: QuotecastUpdateEvent, update: QuotecastUpdate) => {
                            const value = update.values.LastPrice?.value;

                            if (value != null) {
                                unsubscribe?.();
                                unsubscribe = undefined;
                                resolve(value);
                            }
                        }
                    );
                })
            ]).then((activeStrikePrice) => {
                return this.getProductsRequestParams({...filters, activeStrikePrice});
            });
        });
    }
}
