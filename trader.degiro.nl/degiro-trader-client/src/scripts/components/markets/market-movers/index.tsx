import Select, {SelectOption, SelectSizes} from 'frontend-core/dist/components/ui-trader4/select/index';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {MarketIndex} from 'frontend-core/dist/models/market-index';
import {StockCountry} from 'frontend-core/dist/models/stock';
import localize from 'frontend-core/dist/services/i18n/localize';
import getMarketMoversIndices from 'frontend-core/dist/services/market-movers/get-market-movers-indices';
import getStockCountries from 'frontend-core/dist/services/products/stock/get-stock-countries';
import * as React from 'react';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {MarketMoversSubscriptionParams} from 'frontend-core/dist/models/market-mover';
import useAsync from 'frontend-core/dist/hooks/use-async';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import {loading} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import {ConfigContext, CurrentClientContext, EventBrokerContext, I18nContext} from '../../app-component/app-context';
import Card from '../../card';
import CardHeader from '../../card/header';
import {indicesSelect, listMessage} from './market-movers.css';
import {SubscriptionEvent, unsubscribeAll} from '../../../event-broker/subscription';
import {MarketMoversEvents} from '../../../event-broker/event-types';
import {cardList} from '../markets.css';
import Product from './product';
import ViewMoreLink from '../../view-more-link';
import {Routes} from '../../../navigation';

interface Props {}

const {useEffect, useState, useContext, useMemo} = React;
const getIndexSelectOption = (value: MarketIndex): SelectOption => ({value, label: value.name});
const MarketMovers: React.FunctionComponent<Props> = React.memo(() => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const eventBroker = useContext(EventBrokerContext);
    const [selectedIndex, setSelectedIndex] = useState<MarketIndex>();
    const {value: stockCountries = [], isLoading: areStockCountriesLoading, error: stockCountriesError} = useAsync<
        StockCountry[]
    >(() => getStockCountries(config, currentClient, i18n), [config, currentClient, i18n]);
    const {value: marketIndices = [], isLoading: areMarketIndicesLoading, error: marketIndicesError} = useAsync<
        MarketIndex[]
    >(() => getMarketMoversIndices(config, currentClient), [config, currentClient]);
    const marketIndicesSelectOptions = useMemo<SelectOption[]>(() => marketIndices.map(getIndexSelectOption), [
        marketIndices
    ]);
    const isLoading = useMemo<boolean>(() => areStockCountriesLoading || areMarketIndicesLoading, [
        areStockCountriesLoading,
        areMarketIndicesLoading
    ]);
    const [marketIndexCountry, setMarketIndexCountry] = useState<StockCountry | undefined>();
    const [winners, setWinners] = useState<ProductInfo[]>([]);
    const [losers, setLosers] = useState<ProductInfo[]>([]);
    const hasProducts: boolean = Boolean(isNonEmptyArray(winners) || isNonEmptyArray(losers));
    const [areWinnersLoading, setAreWinnerLoading] = useState<boolean>(true);
    const [areLosersLoading, setAreLosersLoading] = useState<boolean>(true);

    useEffect(() => {
        if (stockCountriesError || marketIndicesError) {
            logErrorLocally(stockCountriesError || marketIndicesError);
        }
    }, [stockCountriesError, marketIndicesError]);

    useEffect(() => {
        if (!isNonEmptyArray(marketIndices)) {
            return;
        }

        const defaultMarketMoversIndexId: string = String(currentClient.settings?.defaultMarketMoversIndexId);

        setSelectedIndex(marketIndices.find(({id}) => defaultMarketMoversIndexId === String(id)) || marketIndices[0]);
    }, [marketIndices]);

    useEffect(() => {
        const marketIndexId: MarketIndex['id'] | undefined = selectedIndex?.id;

        if (isNonEmptyArray(stockCountries) && marketIndexId) {
            setMarketIndexCountry(
                stockCountries.find((stockCountry) =>
                    stockCountry.indices?.some((index: MarketIndex) => index.id === marketIndexId)
                )
            );
        }
    }, [selectedIndex, stockCountries]);

    useEffect(() => {
        const marketIndexId: MarketIndex['id'] | undefined = selectedIndex?.id;

        if (marketIndexId === undefined) {
            return;
        }

        let isWinnersLoading = true;
        let isLosersLoading = true;

        setAreWinnerLoading(isWinnersLoading);
        setAreLosersLoading(isLosersLoading);

        const winnersLoadingTimeout = setTimeout(() => {
            isWinnersLoading = false;
            setAreWinnerLoading(isWinnersLoading);
        }, 3 * 1000 /* 3sec */);
        const losersLoadingTimeout = setTimeout(() => {
            isLosersLoading = false;
            setAreLosersLoading(isLosersLoading);
        }, 3 * 1000 /* 3sec */);
        const marketMoversParams: MarketMoversSubscriptionParams = {
            winnersCount: 6,
            losersCount: 5,
            indexId: marketIndexId
        };
        // When we get new products list from MarketMovers events pipe
        // they do not have VWD data (Last Price, Relative diff, etc.)
        // But products stored in component's state might have VWD data, so we try to reuse that data
        const onWinnersUpdate = (_e: SubscriptionEvent, newWinners: ProductInfo[]) =>
            setWinners((winners) => {
                if (isWinnersLoading) {
                    isWinnersLoading = false;
                    setAreWinnerLoading(isWinnersLoading);
                    clearTimeout(winnersLoadingTimeout);
                    return newWinners;
                }

                return newWinners.map((product) => winners.find(({id}) => id === product.id) || product);
            });
        const onLosersUpdate = (_e: SubscriptionEvent, newLosers: ProductInfo[]) =>
            setLosers((losers) => {
                if (isLosersLoading) {
                    isLosersLoading = false;
                    setAreLosersLoading(isLosersLoading);
                    clearTimeout(losersLoadingTimeout);
                    return newLosers;
                }

                return newLosers.map((product) => losers.find(({id}) => id === product.id) || product);
            });
        const unsubscribeHandlers = [
            () => clearTimeout(losersLoadingTimeout),
            () => clearTimeout(winnersLoadingTimeout),
            eventBroker.once(MarketMoversEvents.WINNERS_LAST_DATA, marketMoversParams, onWinnersUpdate),
            eventBroker.once(MarketMoversEvents.LOSERS_LAST_DATA, marketMoversParams, onLosersUpdate),
            eventBroker.on(MarketMoversEvents.WINNERS_CHANGE, marketMoversParams, onWinnersUpdate),
            eventBroker.on(MarketMoversEvents.LOSERS_CHANGE, marketMoversParams, onLosersUpdate)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, [selectedIndex]);

    return (
        <Card
            innerHorizontalGap={false}
            data-name="marketMovers"
            header={
                <CardHeader title={localize(i18n, 'trader.markets.marketMovers.title')}>
                    {marketIndicesSelectOptions && (
                        <Select
                            className={indicesSelect}
                            size={SelectSizes.XSMALL}
                            onChange={setSelectedIndex}
                            selectedOption={selectedIndex && getIndexSelectOption(selectedIndex)}
                            options={marketIndicesSelectOptions}
                        />
                    )}
                </CardHeader>
            }
            footer={
                hasProducts &&
                marketIndexCountry &&
                selectedIndex && (
                    <ViewMoreLink
                        to={`${Routes.PRODUCTS}?${getQueryString({
                            productType: ProductTypeIds.STOCK,
                            country: marketIndexCountry.id,
                            stockList: selectedIndex.id,
                            stockListType: 'index'
                        })}`}
                        data-name="indexProductsButton">
                        {localize(i18n, 'trader.markets.marketMovers.indexProductsLink', {
                            indexName: selectedIndex.name
                        })}
                    </ViewMoreLink>
                )
            }>
            {(isLoading || (!hasProducts && areWinnersLoading && areLosersLoading)) && (
                <div className={listMessage}>{localize(i18n, 'trader.markets.marketMovers.loading')}</div>
            )}
            {!isLoading && !areWinnersLoading && !areLosersLoading && !hasProducts && (
                <div className={listMessage}>{localize(i18n, 'trader.markets.marketMovers.noProducts')}</div>
            )}
            {hasProducts && (
                <div className={`${cardList} ${areWinnersLoading || areLosersLoading ? loading : ''}`}>
                    {winners.map((productInfo) => (
                        <Product key={productInfo.id} productInfo={productInfo} marketWinners={true} />
                    ))}
                    {losers.map((productInfo) => (
                        <Product key={productInfo.id} productInfo={productInfo} />
                    ))}
                </div>
            )}
        </Card>
    );
});

MarketMovers.displayName = 'MarketMovers';

export default MarketMovers;
