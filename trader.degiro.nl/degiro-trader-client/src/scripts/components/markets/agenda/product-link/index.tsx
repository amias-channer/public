import {ProductInfo} from 'frontend-core/dist/models/product';
import * as React from 'react';
import {Link} from 'react-router-dom';
import getProductDetailsHref from '../../../../services/router/get-product-details-href';
import {productInfo as productInfoClassName, productInfoLink} from './product-link.css';

interface Props {
    className?: string;
    productInfo?: ProductInfo;
}

const ProductLink: React.FunctionComponent<Props> = ({productInfo, children, className = ''}) => {
    return productInfo ? (
        <Link
            to={getProductDetailsHref(productInfo.id)}
            data-name="productLink"
            data-isin={productInfo.isin}
            className={`${productInfoClassName} ${productInfoLink} ${className}`}>
            {children}
        </Link>
    ) : (
        <div className={`${productInfoClassName} ${className}`}>{children}</div>
    );
};

export default React.memo<React.PropsWithChildren<Props>>(ProductLink);
