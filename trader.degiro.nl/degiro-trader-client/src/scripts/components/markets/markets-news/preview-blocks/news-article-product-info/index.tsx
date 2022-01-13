import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import ProductUpdates from '../../../../products-observer/product-updates';
import {nbsp} from '../../../../value';
import Price from '../../../../value/price';
import RelativeDifference from '../../../../value/relative-difference';
import {currentPrice, productInfoWrapper, symbol} from './news-article-product-info.css';

interface Props {
    productInfo: ProductInfo;
    className?: string;
}

const productPricesFields: [QuotecastField, ...QuotecastField[]] = ['CurrentPrice', 'RelativeDifference'];
const NewsArticleProductInfo: React.FunctionComponent<Props> = ({productInfo, className = ''}) => {
    const {id: productId} = productInfo;

    return (
        <div className={`${productInfoWrapper} ${className}`}>
            <div className={symbol}>{productInfo.symbol}</div>
            <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                {(values) => (
                    <>
                        <Price
                            value={values.CurrentPrice?.value}
                            field="CurrentPrice"
                            className={currentPrice}
                            id={productId}
                            prefix={`${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                        />
                        <RelativeDifference
                            value={values.RelativeDifference?.value}
                            field="RelativeDifference"
                            id={productId}
                        />
                    </>
                )}
            </ProductUpdates>
        </div>
    );
};

export default React.memo(NewsArticleProductInfo);
