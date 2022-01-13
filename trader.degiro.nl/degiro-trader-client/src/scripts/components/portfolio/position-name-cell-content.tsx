import * as React from 'react';
import {Link} from 'react-router-dom';
import {Position} from 'frontend-core/dist/models/product';
import ProductTradingButtons from '../product-trading-buttons';
import {nbsp} from '../value';
import ProductActionsButton from '../product-actions-button';
import getProductDetailsHref from '../../services/router/get-product-details-href';
import {productName} from '../table/table.css';
import {accentWhenSelectedLink} from '../../../styles/link.css';
import ProductCategoryBadge from '../product-category-badge';
import PositionName from './position-name';
import getPositionProductLinkId from '../../services/product/get-position-product-link-id';
import useProductNotesFlag from '../product-notes/hooks/use-product-notes-flag';
import ProductNoteHint from '../product-note-hint';

interface Props {
    hasTradingButtons: boolean;
    position: Position;
}

const {memo} = React;
const PositionNameCellContent = memo<Props>(({position, hasTradingButtons}) => {
    const positionNameContent = <PositionName position={position} />;
    const productLinkId = getPositionProductLinkId(position);
    const hasNotes = useProductNotesFlag(productLinkId);
    const {productInfo} = position;

    return (
        <>
            {hasTradingButtons && <ProductTradingButtons productInfo={productInfo} />}
            {productLinkId == null && (
                <span className={productName}>
                    {nbsp}
                    {nbsp}
                    {positionNameContent}
                </span>
            )}
            {/* do not show actions button for "hidden" products, e.g. cash funds */}
            {productLinkId != null && <ProductActionsButton productInfo={productInfo} />}
            {productLinkId != null && (
                <Link
                    tabIndex={1}
                    to={getProductDetailsHref(productLinkId)}
                    className={`${productName} ${accentWhenSelectedLink}`}>
                    {positionNameContent}
                </Link>
            )}
            {productLinkId != null && hasNotes && <ProductNoteHint productInfo={productInfo} />}
            <ProductCategoryBadge productInfo={productInfo} />
        </>
    );
});

PositionNameCellContent.displayName = 'PositionNameCellContent';
export default PositionNameCellContent;
