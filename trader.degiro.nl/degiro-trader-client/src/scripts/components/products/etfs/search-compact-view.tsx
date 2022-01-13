import getEtfs, {ETFsRequestParams} from 'frontend-core/dist/services/products/etf/get-etfs';
import * as React from 'react';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ETFsSearchProps} from './search';
import getAppTopScrollableElement from '../../app-component/get-app-top-scrollable-element';
import ProductCompactView from '../product-compact-view';
import InfiniteScrollWithScrollRestoration from '../../infinite-scroll/infinite-scroll-with-scroll-restoration';
import useSwipeableItems from '../../swipeable/hooks/use-swipeable-items';
import {loading, frame, emptyListResult} from '../products.css';
import useCompactViewSearchParams from '../hooks/use-compact-view-search-params';
import NoProductsMessage from '../../no-products-message';

const {useEffect, useMemo} = React;

interface ProductsFrameProps {
    index: number;
    searchParams: ETFsSearchProps['searchParams'];
}

const ProductsFrame = React.memo<ProductsFrameProps>(({index, searchParams}) => {
    const {products, isLoading, error} = useCompactViewSearchParams<ProductInfo, ETFsRequestParams>(
        (config, currentClient, searchParams) => getEtfs(config, currentClient, searchParams),
        index,
        searchParams
    );
    const {onItemSwipe, getItemSwipePosition, undoItemSwipe} = useSwipeableItems(getAppTopScrollableElement());

    useEffect(() => error && logErrorLocally(error), [error]);

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

const EtfsSearchCompactView = React.memo<ETFsSearchProps>(({searchParams}) => {
    const appScrollableElement = getAppTopScrollableElement();
    const key = useMemo(() => JSON.stringify(searchParams), [searchParams]);

    return appScrollableElement ? (
        <InfiniteScrollWithScrollRestoration key={key} scrollContainerDOMElement={appScrollableElement}>
            {(index) => <ProductsFrame index={index} searchParams={searchParams} />}
        </InfiniteScrollWithScrollRestoration>
    ) : null;
});

EtfsSearchCompactView.displayName = 'EtfsSearchCompactView';
export default EtfsSearchCompactView;
