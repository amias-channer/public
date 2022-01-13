import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {MarketFuture} from 'frontend-core/dist/models/future';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import localize from 'frontend-core/dist/services/i18n/localize';
import getMarketFutures from 'frontend-core/dist/services/products/future/get-market-futures';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../styles/link.css';
import getProductDetailsHref from '../../services/router/get-product-details-href';
import {ConfigContext, CurrentClientContext, I18nContext} from '../app-component/app-context';
import Card from '../card';
import CardHeader from '../card/header';
import CountryFlag from '../country-flag/index';
import {item, itemBadge, secondaryContent} from '../list/list.css';
import ProductTradingButtons from '../product-trading-buttons/index';
import ProductUpdates from '../products-observer/product-updates';
import Price from '../value/price';
import RelativeDifference from '../value/relative-difference';
import {
    cardList,
    cardListItem,
    priceValueText,
    productActions,
    productName,
    relativeDiffValueText
} from './markets.css';

interface Props {}

const {useState, useEffect, useContext} = React;
const productPricesFields: [QuotecastField, ...QuotecastField[]] = ['LastPrice', 'RelativeDifference'];
const MarketFutures: React.FunctionComponent<Props> = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const [products, setProducts] = useState<MarketFuture[]>([]);

    useEffect(() => {
        const productsPromise = createCancellablePromise(getMarketFutures(config, currentClient));

        productsPromise.promise.then(setProducts).catch(logErrorLocally);

        return productsPromise.cancel;
    }, [config, currentClient]);

    return (
        <Card
            innerHorizontalGap={false}
            data-name="marketFutures"
            header={<CardHeader title={localize(i18n, 'trader.markets.futures.title')} />}
            footer={true}>
            <ul className={cardList}>
                {products.map((future: MarketFuture) => {
                    const futureId: string = String(future.id);

                    return (
                        <li key={futureId} className={`${item} ${cardListItem}`}>
                            <CountryFlag country={future.country} className={itemBadge} />
                            <Link
                                to={getProductDetailsHref(futureId)}
                                className={`${accentWhenSelectedLink} ${productName}`}>
                                {future.name}
                            </Link>
                            <div className={secondaryContent}>
                                <ProductUpdates productInfo={future} fields={productPricesFields}>
                                    {(values) => (
                                        <>
                                            <div className={priceValueText}>
                                                <Price
                                                    highlightValueChange={true}
                                                    marked={true}
                                                    id={futureId}
                                                    value={values.LastPrice?.value}
                                                    field="LastPrice"
                                                />
                                            </div>
                                            <div className={relativeDiffValueText}>
                                                <RelativeDifference
                                                    id={futureId}
                                                    value={values.RelativeDifference?.value}
                                                    field="RelativeDifference"
                                                />
                                            </div>
                                        </>
                                    )}
                                </ProductUpdates>
                                <ProductTradingButtons productInfo={future} className={productActions} />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
};

export default React.memo(MarketFutures);
