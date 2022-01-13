import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../../../styles/link.css';
import getProductDetailsHref from '../../../../services/router/get-product-details-href';
import ProductActionsButton from '../../../product-actions-button';
import ProductCategoryBadge from '../../../product-category-badge';
import ProductName from '../../../product-name';
import ProductTradingButtons from '../../../product-trading-buttons';
import ProductUpdates from '../../../products-observer/product-updates';
import TableShadowedWrapper from '../../../table/table-shadowed-wrapper';
import {
    cell,
    inlineEndContentCell,
    priceCell,
    productName,
    row,
    table as tableClassName
} from '../../../table/table.css';
import AbsoluteDifference from '../../../value/absolute-difference';
import Price from '../../../value/price';
import RelativeDifference from '../../../value/relative-difference';
import {newsArticleProducts, productCellContent} from './news-article-products.css';

interface NewsArticleProductsProps {
    products: ProductInfo[];
}
const productPricesFields: [QuotecastField, ...QuotecastField[]] = [
    'CurrentPrice',
    'AbsoluteDifference',
    'RelativeDifference'
];
const NewsArticleProducts: React.FunctionComponent<NewsArticleProductsProps> = ({products}) => (
    <TableShadowedWrapper>
        {() => (
            <table className={`${tableClassName} ${newsArticleProducts}`}>
                <tbody>
                    {products.map((productInfo: ProductInfo) => {
                        const productId: string = String(productInfo.id);

                        return (
                            <tr key={productId} className={row}>
                                <td className={cell}>
                                    <div className={productCellContent}>
                                        <ProductTradingButtons productInfo={productInfo} className={inlineLeft} />
                                        <ProductActionsButton productInfo={productInfo} />
                                        <Link
                                            to={getProductDetailsHref(productInfo.id)}
                                            className={`${productName} ${accentWhenSelectedLink}`}>
                                            <ProductName productInfo={productInfo} />
                                        </Link>
                                        <ProductCategoryBadge productInfo={productInfo} />
                                    </div>
                                </td>
                                <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                                    {(values) => (
                                        <>
                                            <td className={`${cell} ${priceCell} ${inlineEndContentCell}`}>
                                                <Price
                                                    id={productId}
                                                    value={values.CurrentPrice?.value}
                                                    field="CurrentPrice"
                                                />
                                            </td>
                                            <td className={`${cell} ${inlineEndContentCell}`}>
                                                <AbsoluteDifference
                                                    id={productId}
                                                    value={values.AbsoluteDifference?.value}
                                                    field="AbsoluteDifference"
                                                />
                                            </td>
                                            <td className={`${cell} ${inlineEndContentCell}`}>
                                                <RelativeDifference
                                                    id={productId}
                                                    value={values.RelativeDifference?.value}
                                                    field="RelativeDifference"
                                                />
                                            </td>
                                        </>
                                    )}
                                </ProductUpdates>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )}
    </TableShadowedWrapper>
);

export default NewsArticleProducts;
