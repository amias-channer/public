import {WorldMarketIndex} from 'frontend-core/dist/models/market-index';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../../styles/link.css';
import getProductDetailsHref from '../../../services/router/get-product-details-href';
import CountryFlag from '../../country-flag/index';
import {item, itemBadge, secondaryContent} from '../../list/list.css';
import ProductUpdates from '../../products-observer/product-updates';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import {cardList, cardListItem, priceValueText, productName, relativeDiffValueText} from '../markets.css';

interface Props {
    products: WorldMarketIndex[];
}

const productPricesFields: [QuotecastField, ...QuotecastField[]] = ['LastPrice', 'RelativeDifference'];
const MarketIndicesListView: React.FunctionComponent<Props> = ({products}) => (
    <ul className={cardList}>
        {products.map((marketIndex: WorldMarketIndex) => {
            const productId: string = String(marketIndex.id);

            return (
                <li key={productId} className={`${item} ${cardListItem}`}>
                    <CountryFlag country={marketIndex.country} className={itemBadge} />
                    <Link to={getProductDetailsHref(productId)} className={`${accentWhenSelectedLink} ${productName}`}>
                        {marketIndex.name}
                    </Link>
                    <ProductUpdates productInfo={marketIndex} fields={productPricesFields}>
                        {(values) => (
                            <div className={secondaryContent}>
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
                            </div>
                        )}
                    </ProductUpdates>
                </li>
            );
        })}
    </ul>
);

export default React.memo(MarketIndicesListView);
