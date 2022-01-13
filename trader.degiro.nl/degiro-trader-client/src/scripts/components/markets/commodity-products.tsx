import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import localize from 'frontend-core/dist/services/i18n/localize';
import getMarketCommodityProducts from 'frontend-core/dist/services/products/commodity/get-market-commodity-products';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../styles/link.css';
import getProductDetailsHref from '../../services/router/get-product-details-href';
import {ConfigContext, CurrentClientContext, I18nContext} from '../app-component/app-context';
import Card from '../card';
import CardHeader from '../card/header';
import {item, secondaryContent} from '../list/list.css';
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
const CommodityProducts: React.FunctionComponent<Props> = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const [products, setProducts] = useState<ProductInfo[]>([]);

    useEffect(() => {
        const productsPromise = createCancellablePromise(getMarketCommodityProducts(config, currentClient));

        productsPromise.promise.then(setProducts).catch(logErrorLocally);

        return productsPromise.cancel;
    }, [config, currentClient]);

    if (products.length === 0) {
        return null;
    }

    return (
        <Card
            innerHorizontalGap={false}
            header={<CardHeader title={localize(i18n, 'trader.markets.commodityProducts.title')} />}
            footer={true}>
            <ul className={cardList}>
                {products.map((productInfo: ProductInfo) => {
                    const productId: string = String(productInfo.id);

                    return (
                        <li key={productId} className={`${item} ${cardListItem}`}>
                            <Link
                                to={getProductDetailsHref(productId)}
                                className={`${accentWhenSelectedLink} ${productName}`}>
                                {productInfo.name}
                            </Link>
                            <div className={secondaryContent}>
                                <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                                    {(values) => (
                                        <>
                                            <div className={priceValueText}>
                                                <Price
                                                    highlightValueChange={true}
                                                    marked={true}
                                                    id={productId}
                                                    value={values.LastPrice?.value}
                                                    field="LastPrice"
                                                />
                                            </div>
                                            <div className={relativeDiffValueText}>
                                                <RelativeDifference
                                                    id={productId}
                                                    value={values.RelativeDifference?.value}
                                                    field="RelativeDifference"
                                                />
                                            </div>
                                        </>
                                    )}
                                </ProductUpdates>
                                <ProductTradingButtons productInfo={productInfo} className={productActions} />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
};

export default React.memo(CommodityProducts);
