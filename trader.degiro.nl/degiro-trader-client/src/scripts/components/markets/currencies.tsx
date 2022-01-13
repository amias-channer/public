import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {MarketCurrency} from 'frontend-core/dist/models/currency';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import getMarketCurrencies from 'frontend-core/dist/services/currency/get-market-currencies';
import localize from 'frontend-core/dist/services/i18n/localize';
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
import ProductUpdates from '../products-observer/product-updates';
import Price from '../value/price';
import RelativeDifference from '../value/relative-difference';
import {cardList, cardListItem, priceValueText, productName, relativeDiffValueText} from './markets.css';

interface Props {}

const {useState, useEffect, useContext} = React;
const productPricesFields: [QuotecastField, ...QuotecastField[]] = ['LastPrice', 'RelativeDifference'];
const MarketCurrencies: React.FunctionComponent<Props> = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const [products, setProducts] = useState<MarketCurrency[]>([]);

    useEffect(() => {
        const productsPromise = createCancellablePromise(getMarketCurrencies(config, currentClient));

        productsPromise.promise.then(setProducts).catch(logErrorLocally);

        return productsPromise.cancel;
    }, [config, currentClient]);

    return (
        <Card
            innerHorizontalGap={false}
            data-name="marketCurrencies"
            header={<CardHeader title={localize(i18n, 'trader.markets.currencies.title')} />}
            footer={true}>
            <ul className={cardList}>
                {products.map((currencyProduct: MarketCurrency) => {
                    const currencyProductId: string = String(currencyProduct.id);

                    return (
                        <li key={currencyProductId} className={`${item} ${cardListItem}`}>
                            <CountryFlag country={currencyProduct.fromCountry} className={itemBadge} />
                            <CountryFlag country={currencyProduct.toCountry} className={itemBadge} />
                            <Link
                                to={getProductDetailsHref(currencyProductId)}
                                className={`${accentWhenSelectedLink} ${productName}`}>
                                {currencyProduct.name}
                            </Link>
                            <ProductUpdates productInfo={currencyProduct} fields={productPricesFields}>
                                {(values) => (
                                    <div className={secondaryContent}>
                                        <div className={priceValueText}>
                                            <Price
                                                highlightValueChange={true}
                                                marked={true}
                                                id={currencyProductId}
                                                value={values.LastPrice?.value}
                                                field="LastPrice"
                                            />
                                        </div>
                                        <div className={relativeDiffValueText}>
                                            <RelativeDifference
                                                id={currencyProductId}
                                                value={values.RelativeDifference?.value}
                                                field="RelativeDifference"
                                            />
                                        </div>
                                    </div>
                                )}
                            </ProductUpdates>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
};

export default React.memo(MarketCurrencies);
