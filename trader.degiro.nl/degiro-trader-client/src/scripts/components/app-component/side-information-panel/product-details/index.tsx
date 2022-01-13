import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink, hidingUnderlineLink} from '../../../../../styles/link.css';
import getProductDetailsHref from '../../../../services/router/get-product-details-href';
import FeedQuality from '../../../feed-quality';
import ProductActionsButton from '../../../product-actions-button';
import ProductBrief, {ProductBriefField} from '../../../product-brief';
import ProductCategoryBadge from '../../../product-category-badge';
import ProductName from '../../../product-name';
import ProductUpdates from '../../../products-observer/product-updates';
import {nbsp} from '../../../value';
import AbsoluteDifference from '../../../value/absolute-difference';
import Price from '../../../value/price';
import RelativeDifference from '../../../value/relative-difference';
import {blockEndItem, header, priceDifferenceField, priceField, pricesInfo, productName} from './product-details.css';

type Props = React.PropsWithChildren<{
    productInfo: ProductInfo;
    onProductClick?: () => void;
}>;
const productBriefFields: ProductBriefField[] = ['symbol', 'isin', 'exchangeName'];
const productPricesFields: [QuotecastField, ...QuotecastField[]] = [
    'CurrentPrice',
    'AbsoluteDifference',
    'RelativeDifference'
];
const PanelProductDetails: React.FunctionComponent<Props> = ({productInfo, children, onProductClick}) => {
    const productId: string = String(productInfo.id);

    return (
        <div>
            <div className={header}>
                <Link
                    to={getProductDetailsHref(productId)}
                    className={`${accentWhenSelectedLink} ${hidingUnderlineLink}`}
                    onClick={onProductClick}>
                    <ProductName className={productName} productInfo={productInfo} />
                </Link>
                <ProductCategoryBadge className={inlineRight} productInfo={productInfo} />
                {children}
                <ProductActionsButton className={blockEndItem} productInfo={productInfo} />
            </div>
            <ProductBrief productInfo={productInfo} fields={productBriefFields} />
            <div className={pricesInfo}>
                <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                    {(values) => (
                        <>
                            <Price
                                value={values.CurrentPrice?.value}
                                field="CurrentPrice"
                                id={productId}
                                marked={true}
                                className={priceField}
                                prefix={`${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                            />
                            <AbsoluteDifference
                                value={values.AbsoluteDifference?.value}
                                field="AbsoluteDifference"
                                id={productId}
                                className={priceDifferenceField}
                            />
                            <RelativeDifference
                                value={values.RelativeDifference?.value}
                                field="RelativeDifference"
                                id={productId}
                                brackets={true}
                                className={priceDifferenceField}
                            />
                        </>
                    )}
                </ProductUpdates>
                <FeedQuality productInfo={productInfo} />
            </div>
        </div>
    );
};

export default React.memo(PanelProductDetails);
