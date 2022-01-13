import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../../styles/link.css';
import getProductDetailsHref from '../../../services/router/get-product-details-href';
import {item, secondaryContent, underlinedItem} from '../../list/list.css';
import ProductName from '../../product-name/index';
import ProductTradingButtons from '../../product-trading-buttons/index';
import ProductUpdates from '../../products-observer/product-updates';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import {
    cardListItem,
    marketLosersListItem,
    marketWinnersListItem,
    priceValueText,
    productActions,
    productName,
    relativeDiffValueText
} from '../markets.css';

interface Props {
    productInfo: ProductInfo;
    marketWinners?: true;
}

const productPricesFields: [QuotecastField, ...QuotecastField[]] = ['LastPrice', 'RelativeDifference'];
const Product: React.FunctionComponent<Props> = React.memo(({marketWinners, productInfo}) => {
    const productId: string = String(productInfo.id);
    const marketMoverType = marketWinners ? 'marketWinner' : 'marketLoser';

    return (
        <div
            key={`${marketMoverType}${productId}`}
            data-name={marketMoverType}
            className={`
                ${item} 
                ${underlinedItem} 
                ${cardListItem} 
                ${marketWinners ? marketWinnersListItem : marketLosersListItem}
            `}>
            <Link to={getProductDetailsHref(productId)} className={`${accentWhenSelectedLink} ${productName}`}>
                <ProductName productInfo={productInfo} />
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
        </div>
    );
});

Product.displayName = 'Product';

export default Product;
