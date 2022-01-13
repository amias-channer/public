import {accentIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import Select, {SelectOption} from 'frontend-core/dist/components/ui-trader4/select/index';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Exchange} from 'frontend-core/dist/models/exchange';
import {OptionProduct, OptionsSearchResult, OptionStrikeType, OptionUnderlying} from 'frontend-core/dist/models/option';
import {ProductInfo} from 'frontend-core/dist/models/product';
import getMonthName from 'frontend-core/dist/services/date/get-month-name';
import {SortTypes} from 'frontend-core/dist/services/filter';
import localize from 'frontend-core/dist/services/i18n/localize';
import getOptionStrikeTypes from 'frontend-core/dist/services/products/option/get-option-strike-types';
import getOptions, {OptionsRequestParams} from 'frontend-core/dist/services/products/option/get-options';
import getProductInfo from 'frontend-core/dist/services/products/product/get-product-info';
import getQuotecastRequestProductInfo from 'frontend-core/dist/services/quotecast/get-quotecast-request-product-info';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {useLocation} from 'react-router-dom';
import {QuotecastEvents} from '../../../../event-broker/event-types';
import {QuotecastUpdate, QuotecastUpdateEvent} from '../../../../event-broker/resources/quotecast';
import {informationPanelSideLayout} from '../../../../media-queries/index';
import {OptionsFiltersManager} from '../../../../services/product/options/filters-manager';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    EventBrokerContext,
    I18nContext
} from '../../../app-component/app-context';
import PanelHeader from '../../../app-component/side-information-panel/header';
import HeaderNavigationButton from '../../../header/compact-header/header-navigation-button';
import NoProductsMessage from '../../../no-products-message/index';
import Spinner from '../../../progress-bar/spinner';
import {cell, centerContentCell, headerCell, row} from '../../../table/table.css';
import UnderlyingTable from '../../../underlying-table/index';
import {
    content,
    filters,
    filtersSection,
    layout,
    periodSelect,
    productsTable,
    tableHeaderProductCell,
    underlyingTable
} from './product-picker.css';

interface Props {
    underlying: OptionUnderlying;
    exchange: Exchange;
    onProductSelect(productInfo: ProductInfo): void;
    onClose(): void;
}

interface OptionProductDateOption extends SelectOption {
    /**
     * part of ProductInfo.expirationDate
     * 1-2019
     * 2-2019
     * 10-2020
     * 12-2020
     */
    value: string;
    label: string;
}

interface OptionStrikeTypeOption extends SelectOption {
    value: OptionStrikeType;
}

const {useState, useMemo, useEffect, useContext} = React;
const ProductPicker: React.FunctionComponent<Props> = ({onProductSelect, onClose, exchange, underlying}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const eventBroker = useContext(EventBrokerContext);
    const addIcon: React.ReactElement = <Icon type="add_circle" className={accentIcon} />;
    const {underlyingProductId} = underlying;
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [date, setDate] = useState<string | undefined>();
    const [activeStrikePrice, setActiveStrikePrice] = useState<number | undefined>();
    const [products, setProducts] = useState<OptionProduct[]>([]);
    const [underlyingProduct, setUnderlyingProduct] = useState<ProductInfo | undefined>();
    const [strikeTypeOptions, setStrikeTypeOptions] = useState<OptionStrikeTypeOption[]>([]);
    const [dateOptions, setDateOptions] = useState<OptionProductDateOption[]>([]);
    const [strikeType, setStrikeType] = useState<OptionStrikeType | undefined>();
    const hasSideLayout: boolean = useMediaQuery(informationPanelSideLayout);
    const selectedDateOption: OptionProductDateOption | undefined = useMemo(() => {
        return dateOptions.find((option) => option.value === date);
    }, [dateOptions, date]);
    const filteredProducts: OptionProduct[] = useMemo(() => {
        if (!date) {
            return [];
        }

        /**
         * @description
         *  -2-2019
         *  -12-2020
         * @type {string}
         */
        const dateSearchStr: string = `-${date}`;

        return products.filter((product: OptionProduct) => {
            return (
                product.call?.expirationDate?.includes(dateSearchStr) ||
                product.put?.expirationDate?.includes(dateSearchStr)
            );
        });
    }, [products, date]);
    const getStrikeTypeSelectOption = (strikeType: OptionStrikeType): OptionStrikeTypeOption => ({
        value: strikeType,
        label: localize(i18n, strikeType.translation)
    });

    useEffect(() => {
        if (!strikeType) {
            return;
        }

        const filtersManager = new OptionsFiltersManager(currentClient, location);
        const requestParams: OptionsRequestParams = {
            ...filtersManager.getProductsRequestParams({
                // default filters
                ...filtersManager.data.filters,
                strikeType: strikeType.id,
                // use the last value of `activeStrikePrice` we have in a scope, do not add it to the deps list to
                // not make a request on every price update
                activeStrikePrice,
                exchange: String(exchange.id),
                underlying: underlying.isin
            }),
            offset: 0,
            requireTotal: false,
            sortColumns: ['expirationDate'],
            sortTypes: [SortTypes.ASC]
        };

        setIsLoading(true);
        setDate(undefined);
        setDateOptions([]);
        setProducts([]);

        const loadRequest = createCancellablePromise(getOptions(config, requestParams));

        loadRequest.promise
            .then((result: OptionsSearchResult) => {
                const products: OptionProduct[] = [];
                const dateOptions: OptionProductDateOption[] = [];
                const processedDates: Set<string> = new Set();

                result.data.forEach((product: OptionProduct) => {
                    const {call, put} = product;
                    const dateSeparator: string = '-';
                    const {strikePrice: callStrikePrice, expirationDate: callExpirationDate} = call || {};
                    const {strikePrice: putStrikePrice, expirationDate: putExpirationDate} = put || {};

                    // do not store products without CALL or PUT strike price
                    if (callStrikePrice !== undefined || putStrikePrice !== undefined) {
                        [callExpirationDate?.split(dateSeparator), putExpirationDate?.split(dateSeparator)].forEach(
                            (dateParts: undefined | string[]) => {
                                if (!dateParts) {
                                    return;
                                }

                                const monthWithYear: string = dateParts.slice(1).join(dateSeparator);

                                if (!processedDates.has(monthWithYear)) {
                                    processedDates.add(monthWithYear);
                                    /**
                                     * @description 1-12
                                     * @type {number}
                                     */
                                    const monthIndex: number = Number(dateParts[1]);

                                    dateOptions.push({
                                        value: monthWithYear,
                                        label: `${getMonthName(i18n, monthIndex)} ${dateParts[2]}`
                                    });
                                }
                            }
                        );

                        products.push(product);
                    }
                });

                setIsLoading(false);
                setDate(dateOptions[0]?.value);
                setDateOptions(dateOptions);
                setProducts(products);
            })
            .catch((error: Error | AppError) => {
                app.openModal({error});
                setIsLoading(false);
            });

        return loadRequest.cancel;
    }, [strikeType]);

    useEffect(() => {
        setUnderlyingProduct(undefined);

        if (underlyingProductId === undefined) {
            return;
        }

        const loadRequest = createCancellablePromise(
            getProductInfo(config, currentClient, {id: String(underlyingProductId)})
        );

        loadRequest.promise.then(setUnderlyingProduct).catch(logErrorLocally);

        return loadRequest.cancel;
    }, [underlyingProductId]);

    useEffect(() => {
        setActiveStrikePrice(undefined);

        if (!underlyingProduct) {
            return;
        }

        const onUnderlyingProductUpdate = (_event: QuotecastUpdateEvent, update: QuotecastUpdate) => {
            setActiveStrikePrice(update.values.CurrentPrice?.value ?? undefined);
        };

        return eventBroker.on(
            QuotecastEvents.CHANGE,
            {products: [getQuotecastRequestProductInfo(underlyingProduct)], fields: ['CurrentPrice']},
            onUnderlyingProductUpdate
        );
    }, [underlyingProduct]);

    useEffect(() => {
        // reset to the default one
        setStrikeType(strikeTypeOptions[0]?.value);
    }, [underlyingProductId, strikeTypeOptions]);

    useEffect(() => {
        const loadRequest = createCancellablePromise(getOptionStrikeTypes());

        loadRequest.promise
            .then((strikeTypes: OptionStrikeType[]) => {
                setStrikeTypeOptions(strikeTypes.map(getStrikeTypeSelectOption));
                setIsLoading(false);
            })
            .catch(logErrorLocally);

        return loadRequest.cancel;
    }, []);

    return (
        <div className={layout} data-name="productPicker">
            <PanelHeader onAction={onClose}>{localize(i18n, 'trader.combinationOrder.selectProduct')}</PanelHeader>
            {!hasSideLayout && <HeaderNavigationButton data-name="productPickerBackButton" onClick={onClose} />}
            <div className={content}>
                {strikeTypeOptions[0] && (
                    <div className={filters}>
                        <div className={filtersSection}>
                            <Select
                                name="strikeType"
                                disabled={!activeStrikePrice}
                                selectedOption={strikeType && getStrikeTypeSelectOption(strikeType)}
                                onChange={setStrikeType}
                                options={strikeTypeOptions}
                            />
                        </div>
                    </div>
                )}
                <UnderlyingTable underlyingProductId={underlyingProductId} className={underlyingTable} />
                {isLoading ? (
                    <Spinner />
                ) : filteredProducts[0] ? (
                    <table className={productsTable}>
                        <thead>
                            <tr className={row}>
                                <th className={tableHeaderProductCell}>
                                    {localize(i18n, 'trader.combinationOrder.calls')}
                                </th>
                                <th className={`${headerCell} ${centerContentCell}`}>
                                    {dateOptions[1] ? (
                                        <Select
                                            name="month"
                                            onChange={setDate}
                                            selectedOption={selectedDateOption}
                                            className={periodSelect}
                                            options={dateOptions}
                                        />
                                    ) : (
                                        selectedDateOption?.label
                                    )}
                                </th>
                                <th className={tableHeaderProductCell}>
                                    {localize(i18n, 'trader.combinationOrder.puts')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(({call, put}: OptionProduct) => {
                                const currency: string | undefined = call?.currency || put?.currency;
                                const strikePrice: number | undefined | null = call?.strikePrice || put?.strikePrice;

                                return (
                                    <tr key={`${call ? call.id : ''};${put ? put.id : ''}`} className={row}>
                                        <td className={`${cell} ${centerContentCell}`}>
                                            {call && (
                                                <button
                                                    type="button"
                                                    onClick={onProductSelect.bind(null, call)}
                                                    data-name="call"
                                                    data-id={call.id}>
                                                    {addIcon}
                                                </button>
                                            )}
                                        </td>
                                        <td className={`${cell} ${centerContentCell}`}>
                                            {getCurrencySymbol(currency)} {strikePrice}
                                        </td>
                                        <td className={`${cell} ${centerContentCell}`}>
                                            {put && (
                                                <button
                                                    type="button"
                                                    onClick={onProductSelect.bind(null, put)}
                                                    data-name="put"
                                                    data-id={put.id}>
                                                    {addIcon}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <NoProductsMessage />
                )}
            </div>
        </div>
    );
};

export default React.memo(ProductPicker);
