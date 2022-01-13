import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Link} from 'react-router-dom';
import getProductDetailsHref from '../../../services/router/get-product-details-href';
import {
    item,
    primaryContentAsColumn,
    primaryContentTitle,
    secondaryContentAsColumn,
    secondaryContentTitle,
    subContent,
    underlinedItem
} from '../../list/list.css';
import ProductBrief, {ProductBriefField} from '../../product-brief';
import ProductName from '../../product-name';
import ProductUpdates from '../../products-observer/product-updates';
import Swipeable, {SwipePosition} from '../../swipeable';
import {OnSwipeHandler} from '../../swipeable/hooks/use-swipeable-items';
import SwipeableProductActions from '../../swipeable/swipeable-product-actions';
import SwipeableTradingActions from '../../swipeable/swipeable-trading-actions';
import {nbsp} from '../../value';
import AbsoluteDifference from '../../value/absolute-difference';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import {listItem} from './product-compact-view.css';

interface Props {
    onAction?: () => void;
    onSwipe?: OnSwipeHandler;
    productInfo: ProductInfo;
    swipePosition?: SwipePosition;
}

const {useCallback} = React;
const productPricesFields: [QuotecastField, ...QuotecastField[]] = [
    'LastPrice',
    'AbsoluteDifference',
    'RelativeDifference'
];
const productBriefFields: ProductBriefField[] = ['symbol'];
const ProductCompactView = React.memo<Props>(({onAction, onSwipe, productInfo, swipePosition}) => {
    const productId: string = String(productInfo.id);
    const handleSwipe = useCallback((position: SwipePosition) => onSwipe?.(productId, position), [onSwipe, productId]);

    return (
        <Swipeable
            leadingActions={<SwipeableProductActions onAction={onAction} productInfo={productInfo} />}
            trailingActions={<SwipeableTradingActions onAction={onAction} productInfo={productInfo} />}
            onSwipe={handleSwipe}
            position={swipePosition}>
            <Link
                to={getProductDetailsHref(productId)}
                className={listItem}
                data-id={productId}
                data-name="productsSearchResultItem">
                <div className={`${item} ${underlinedItem}`}>
                    <div className={primaryContentAsColumn}>
                        <ProductName className={primaryContentTitle} productInfo={productInfo} />
                        <ProductBrief className={subContent} productInfo={productInfo} fields={productBriefFields} />
                    </div>
                    <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                        {(values) => (
                            <div className={secondaryContentAsColumn}>
                                <Price
                                    id={productId}
                                    className={secondaryContentTitle}
                                    highlightValueChange={true}
                                    prefix={`${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                                    field="LastPrice"
                                    value={values.LastPrice?.value}
                                />
                                <div>
                                    <AbsoluteDifference
                                        id={productId}
                                        field="AbsoluteDifference"
                                        value={values.AbsoluteDifference?.value}
                                    />
                                    {nbsp}
                                    <RelativeDifference
                                        id={productId}
                                        field="RelativeDifference"
                                        value={values.RelativeDifference?.value}
                                    />
                                </div>
                            </div>
                        )}
                    </ProductUpdates>
                </div>
            </Link>
        </Swipeable>
    );
});

ProductCompactView.displayName = 'ProductCompactView';

export default ProductCompactView;
