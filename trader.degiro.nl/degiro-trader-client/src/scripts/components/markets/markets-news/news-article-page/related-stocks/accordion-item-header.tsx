import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Link} from 'react-router-dom';
import getProductDetailsHref from '../../../../../services/router/get-product-details-href';
import ProductCategoryBadge from '../../../../product-category-badge';
import ProductName from '../../../../product-name';
import ProductUpdates from '../../../../products-observer/product-updates';
import Price from '../../../../value/price';
import RelativeDifference from '../../../../value/relative-difference';
import {accordionItemHeader, currencySymbol, headerItem, productName} from './related-stocks.css';

interface Props {
    productInfo: ProductInfo;
}

const productPricesFields: [QuotecastField, ...QuotecastField[]] = ['CurrentPrice', 'RelativeDifference'];
const AccordionItemHeader: React.FunctionComponent<Props> = ({productInfo}) => {
    const {id} = productInfo;

    return (
        <span className={accordionItemHeader}>
            <Link to={getProductDetailsHref(id)} className={productName}>
                <ProductName productInfo={productInfo} />
            </Link>
            <ProductCategoryBadge productInfo={productInfo} className={headerItem} />
            <span className={currencySymbol}>{getCurrencySymbol(productInfo.currency)}</span>
            <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                {(values) => (
                    <>
                        <Price id={id} value={values.CurrentPrice?.value} field="CurrentPrice" className={headerItem} />
                        <RelativeDifference
                            id={id}
                            value={values.RelativeDifference?.value}
                            brackets={true}
                            field="RelativeDifference"
                            className={headerItem}
                        />
                    </>
                )}
            </ProductUpdates>
        </span>
    );
};

export default React.memo(AccordionItemHeader);
