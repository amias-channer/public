import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {loading} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {CommonOrderEvents} from '../../event-broker/event-types';
import {CommonOrderInfo} from '../../models/order';
import isTradableProduct from '../../services/product/is-tradable-product';
import getProductDetailsHref from '../../services/router/get-product-details-href';
import {ConfigContext, EventBrokerContext, I18nContext, MainClientContext} from '../app-component/app-context';
import FavouriteProductIcon from '../favourites/favourite-product-icon';
import useFavouriteLists from '../favourites/hooks/use-favourite-lists';
import {actionIcon, actionItem, actionItemsSeparator} from '../menu/actions-menu.css';
import OcoOrderTradingButton from '../order/oco-order-trading-button';
import getExternalChartUrl from '../product-chart/get-external-chart-url';
import ProductNoteActionButton, {
    ProductNoteActionButtonChildrenRenderer
} from '../product-notes/product-note-action-button';
import ProductNoteIcon from '../product-notes/product-note-icon';

export enum ProductActionTypes {
    BUY = 'buy',
    FAVOURITES = 'favourites',
    NOTES = 'notes',
    OCO_ORDER = 'ocoOrder',
    SELL = 'sell',
    SHOW_CHART = 'showChart'
}

interface Props {
    productInfo: ProductInfo;
    onAction?: (action: ProductActionTypes) => void;
}

const {useMemo, useCallback, useContext, memo} = React;
const ProductActions = memo<Props>(({productInfo, onAction}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const mainClient = useContext(MainClientContext);
    const {value: favouriteLists, isLoading: isFavouriteListsLoading} = useFavouriteLists();
    const isFavouriteProduct = useMemo<boolean>(
        () => Boolean(favouriteLists?.some(({productIds}) => productIds.includes(String(productInfo.id)))),
        [favouriteLists, productInfo.id]
    );
    const onTradingAction = useCallback(
        (orderInfo: CommonOrderInfo) => {
            eventBroker.emit(CommonOrderEvents.OPEN, orderInfo);
            onAction?.(ProductActionTypes.OCO_ORDER);
        },
        [eventBroker, onAction]
    );
    const productId = String(productInfo.id);
    const chartUrl = useMemo(() => getExternalChartUrl(config, mainClient, productInfo), [
        config,
        mainClient,
        productInfo
    ]);
    const renderProductNoteActionButtonChildren = useCallback<ProductNoteActionButtonChildrenRenderer>(
        (hasNotes) => (
            <>
                {hasNotes
                    ? localize(i18n, 'trader.productActions.notes.status.added')
                    : localize(i18n, 'trader.productActions.notes.actions.add')}
                <ProductNoteIcon active={hasNotes} className={actionIcon} />
            </>
        ),
        [i18n]
    );

    return (
        <>
            <Link to={getProductDetailsHref(productId)} className={actionItem}>
                {localize(i18n, 'trader.productDetails.title')}
            </Link>
            {chartUrl && (
                <NewTabLink
                    href={chartUrl}
                    className={actionItem}
                    onClick={onAction?.bind(null, ProductActionTypes.SHOW_CHART)}>
                    {localize(i18n, 'trader.productChart.moreDetailsLink')}
                    <Icon type="interactive_graph" className={actionIcon} />
                </NewTabLink>
            )}
            <ProductNoteActionButton
                productInfo={productInfo}
                data-test-key="add-product-notes-button"
                className={actionItem}
                onClick={onAction?.bind(null, ProductActionTypes.NOTES)}>
                {renderProductNoteActionButtonChildren}
            </ProductNoteActionButton>
            <button
                type="button"
                data-test-key="favouriteProductSettingsButton"
                onClick={isFavouriteListsLoading ? undefined : () => onAction?.(ProductActionTypes.FAVOURITES)}
                className={`${actionItem} ${isFavouriteListsLoading ? loading : ''}`}>
                {localize(
                    i18n,
                    isFavouriteProduct
                        ? 'trader.productActions.watchlist.status.added'
                        : 'trader.productActions.watchlist.actions.addProduct'
                )}
                <FavouriteProductIcon active={isFavouriteProduct} className={actionIcon} />
            </button>
            {isTradableProduct(productInfo) && (
                <>
                    <div className={actionItemsSeparator} />
                    <button
                        className={actionItem}
                        type="button"
                        data-test-key="buyButton"
                        onClick={() => {
                            eventBroker.emit(CommonOrderEvents.OPEN, {isBuyAction: true, productInfo});
                            onAction?.(ProductActionTypes.BUY);
                        }}>
                        {localize(i18n, 'trader.productActions.buy')}
                    </button>
                    <button
                        className={actionItem}
                        type="button"
                        data-test-key="sellButton"
                        onClick={() => {
                            eventBroker.emit(CommonOrderEvents.OPEN, {isBuyAction: false, productInfo});
                            onAction?.(ProductActionTypes.SELL);
                        }}>
                        {localize(i18n, 'trader.productActions.sell')}
                    </button>
                    <OcoOrderTradingButton
                        className={actionItem}
                        productInfo={productInfo}
                        onTradingAction={onTradingAction}
                    />
                </>
            )}
        </>
    );
});

ProductActions.displayName = 'ProductActions';
export default ProductActions;
