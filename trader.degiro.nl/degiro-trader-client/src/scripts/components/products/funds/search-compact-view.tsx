import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import getFunds from 'frontend-core/dist/services/products/fund/get-funds';
import * as React from 'react';
import {FundsSearchProps} from './search';
import useCompactViewSearchParams from '../hooks/use-compact-view-search-params';
import {emptyListResult, frame, loading} from '../products.css';
import ProductCompactView from '../product-compact-view';
import getAppTopScrollableElement from '../../app-component/get-app-top-scrollable-element';
import InfiniteScrollWithScrollRestoration from '../../infinite-scroll/infinite-scroll-with-scroll-restoration';
import NoProductsMessage from '../../no-products-message';
import useSwipeableItems from '../../swipeable/hooks/use-swipeable-items';

const {useEffect, useMemo} = React;

interface ProductsFrameProps {
    index: number;
    searchParams: FundsSearchProps['searchParams'];
    onData: FundsSearchProps['onData'];
}

const ProductsFrame = React.memo<ProductsFrameProps>(({index, searchParams, onData}) => {
    const {products, isLoading, error} = useCompactViewSearchParams(
        (config, currentClient, searchParams) => getFunds(config, currentClient, searchParams),
        index,
        searchParams
    );
    const {onItemSwipe, getItemSwipePosition, undoItemSwipe} = useSwipeableItems(getAppTopScrollableElement());

    useEffect(() => error && logErrorLocally(error), [error]);
    useEffect(() => products && onData?.(products), [products]);

    return (
        <div className={`${frame} ${isLoading ? loading : ''}`}>
            {products?.map((productInfo) => {
                const {id: productId} = productInfo;

                return (
                    <ProductCompactView
                        key={productId}
                        onAction={undoItemSwipe}
                        onSwipe={onItemSwipe}
                        productInfo={productInfo}
                        swipePosition={getItemSwipePosition(productId)}
                    />
                );
            })}
            {products?.length === 0 && index === 0 && <NoProductsMessage className={emptyListResult} />}
        </div>
    );
});

ProductsFrame.displayName = 'ProductsFrame';

const FundsSearchCompactView = React.memo<FundsSearchProps>(({searchParams, onData}) => {
    const key = useMemo(() => JSON.stringify(searchParams), [searchParams]);

    return (
        <InfiniteScrollWithScrollRestoration key={key} scrollContainerDOMElement={getAppTopScrollableElement()}>
            {(index) => <ProductsFrame index={index} searchParams={searchParams} onData={onData} />}
        </InfiniteScrollWithScrollRestoration>
    );
});

FundsSearchCompactView.displayName = 'FundsSearchCompactView';

export default FundsSearchCompactView;
