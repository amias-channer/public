import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {ProductInfo} from 'frontend-core/dist/models/product';
import ProductTradingButtons from '../../product-trading-buttons';
import ProductActionsButton from '../../product-actions-button';
import getProductDetailsHref from '../../../services/router/get-product-details-href';
import {productName} from '../../table/table.css';
import {accentWhenSelectedLink} from '../../../../styles/link.css';
import ProductCategoryBadge from '../../product-category-badge';
import ProductName from '../../product-name';
import useProductNotesFlag from '../../product-notes/hooks/use-product-notes-flag';

const ProductNoteHint = createLazyComponent(
    () => import(/* webpackChunkName: "product-note-text" */ '../../product-note-hint')
);

type Props = React.PropsWithChildren<{
    productInfo: ProductInfo;
}>;

const {memo} = React;
const ProductNameCellContent = memo<Props>(({productInfo, children}) => {
    const hasNotes = useProductNotesFlag(productInfo.id);

    return (
        <>
            <ProductTradingButtons productInfo={productInfo} />
            <ProductActionsButton productInfo={productInfo} />
            <Link
                to={getProductDetailsHref(productInfo.id)}
                className={`${productName} ${accentWhenSelectedLink}`}
                tabIndex={1}>
                <ProductName productInfo={productInfo} />
                {children}
            </Link>
            {hasNotes && <ProductNoteHint productInfo={productInfo} />}
            <ProductCategoryBadge productInfo={productInfo} />
        </>
    );
});

ProductNameCellContent.displayName = 'ProductNameCellContent';
export default ProductNameCellContent;
