import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import Hint from '../hint/index';
import {badge} from './product-category-badge.css';

interface ProductCategoryProps {
    productInfo: ProductInfo;
    className?: string;
}

const {useContext, memo} = React;
const ProductCategoryBadge = memo<ProductCategoryProps>(({productInfo, className = ''}) => {
    const i18n = useContext(I18nContext);
    const {category, id: productId} = productInfo;

    if (!category) {
        return null;
    }

    return (
        <Hint
            className={`${badge} ${className}`}
            content={localize(i18n, 'trader.productDetails.category', {category})}
            data-id={productId}
            data-name="productCategory">
            {category}
        </Hint>
    );
});

ProductCategoryBadge.displayName = 'ProductCategoryBadge';
export default ProductCategoryBadge;
