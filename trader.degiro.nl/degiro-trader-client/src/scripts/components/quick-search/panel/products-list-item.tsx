import {ProductInfo} from 'frontend-core/dist/models/product';
import * as React from 'react';
import {Link} from 'react-router-dom';
import getProductDetailsHref from '../../../services/router/get-product-details-href';
import ProductBrief, {ProductBriefField} from '../../product-brief';
import ProductName from '../../product-name';
import ProductTradingButtons from '../../product-trading-buttons';
import {listItem, listItemPrimaryContent, productName} from './panel.css';

interface Props {
    productInfo: ProductInfo;
    secondaryActions?: React.ReactNode;
    onClick?: React.MouseEventHandler;
    onTradingButtonsClick?: React.MouseEventHandler;
}

const productBriefFields: ProductBriefField[] = ['exchangeAbbr', 'symbol', 'isin', 'currency'];
const ProductsListItem: React.FunctionComponent<Props> = ({
    productInfo,
    secondaryActions,
    onClick,
    onTradingButtonsClick
}) => (
    <div onClick={onClick} className={listItem}>
        <Link to={getProductDetailsHref(productInfo.id)} className={listItemPrimaryContent} tabIndex={1}>
            <ProductName productInfo={productInfo} className={productName} />
            <ProductBrief productInfo={productInfo} fields={productBriefFields} />
        </Link>
        <div>
            <ProductTradingButtons productInfo={productInfo} onClick={onTradingButtonsClick} />
            {secondaryActions}
        </div>
    </div>
);

export default React.memo(ProductsListItem);
