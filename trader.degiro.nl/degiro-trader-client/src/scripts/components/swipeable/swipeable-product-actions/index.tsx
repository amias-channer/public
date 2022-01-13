import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import FavouriteActionMenu, {FavouriteActionMenuTargetRenderer} from '../../favourites/favourite-action-menu';
import FavouriteProductIcon from '../../favourites/favourite-product-icon';
import ProductNoteActionButton, {
    ProductNoteActionButtonChildrenRenderer
} from '../../product-notes/product-note-action-button';
import ProductNoteIcon from '../../product-notes/product-note-icon';
import {action, actions, actionWrapper} from './swipeable-product-actions.css';

export interface SwipeableProductActionsProps {
    onAction?: () => void;
    productInfo: ProductInfo;
}

const {memo, useCallback, useContext} = React;
const SwipeableProductActions: React.FunctionComponent<SwipeableProductActionsProps> = ({onAction, productInfo}) => {
    const i18n = useContext(I18nContext);
    const renderFavouriteActionMenuTarget = useCallback<FavouriteActionMenuTargetRenderer>(
        ({isFavouriteProduct, onClick}) => (
            <button
                aria-label={localize(i18n, 'trader.navigation.favourites')}
                className={action}
                tabIndex={-1}
                type="button"
                onClick={onClick}>
                <FavouriteProductIcon accent={false} active={Boolean(isFavouriteProduct)} />
                {isFavouriteProduct
                    ? localize(i18n, 'trader.productActions.watchlist.status.added')
                    : localize(i18n, 'trader.productActions.watchlist.actions.addProduct')}
            </button>
        ),
        [i18n]
    );
    const renderProductNoteActionButtonChildren = useCallback<ProductNoteActionButtonChildrenRenderer>(
        (hasNotes) => (
            <>
                <ProductNoteIcon accent={false} active={hasNotes} />
                {hasNotes
                    ? localize(i18n, 'trader.productActions.notes.status.added')
                    : localize(i18n, 'trader.productActions.notes.actions.add')}
            </>
        ),
        [i18n]
    );

    return (
        <div className={actions}>
            <FavouriteActionMenu
                className={actionWrapper}
                horizontalPosition="inside-start"
                verticalPosition="inside-start"
                onClose={onAction}
                productInfo={productInfo}
                renderTarget={renderFavouriteActionMenuTarget}
            />
            <ProductNoteActionButton className={action} onClick={onAction} productInfo={productInfo} tabIndex={-1}>
                {renderProductNoteActionButtonChildren}
            </ProductNoteActionButton>
        </div>
    );
};

export default memo(SwipeableProductActions);
