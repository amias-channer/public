import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import createComposedClassNameSelector from 'frontend-core/dist/utils/css/create-composed-classname-selector';
import {addDocumentKeydownStackableEventListener} from 'frontend-core/dist/utils/events/add-stackable-event-listener';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {activeButtonWithBackdrop, selectableButtonWithBackdrop} from '../button/button.css';
import {icon, layout, layoutWithDefaultIcon} from '../hint/hint.css';
import Menu from '../menu';
import {actionsMenu} from '../menu/actions-menu.css';
import {tooltipPopoverClassName} from '../tooltip-popover';
import ProductActions, {ProductActionTypes} from './product-actions';
import {toggleIconWrapper} from './product-actions-button.css';

const FavouriteProductSettings = createLazyComponent(
    () => import(/* webpackChunkName: "favourite-product-settings" */ '../favourites/favourite-product-settings')
);

interface Props {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    productInfo: ProductInfo;
}

const {useCallback, useLayoutEffect, useContext, useState, memo} = React;
const ProductActionsButton = memo<Props>(({productInfo, onClick, className = ''}) => {
    const i18n = useContext(I18nContext);
    const {id: productId} = productInfo;
    const {isOpened, close, toggle} = useToggle();
    const [selectedAction, setSelectedAction] = useState<ProductActionTypes>();
    const resetActionAndClosePopup = useCallback(() => {
        setSelectedAction(undefined);
        close();
    }, [close]);
    const handleAction = useCallback((action: ProductActionTypes) => {
        switch (action) {
            case ProductActionTypes.FAVOURITES: {
                setSelectedAction(action);
                return;
            }
            default: {
                close();
            }
        }
    }, []);

    useLayoutEffect(() => {
        if (selectedAction) {
            return addDocumentKeydownStackableEventListener(
                () => setSelectedAction(undefined),
                ({key}) => key === 'Escape' && Boolean(selectedAction)
            );
        }
    }, [selectedAction]);

    return (
        <Menu
            // [TRADER-2508]
            innerPopupRefs={[createComposedClassNameSelector(tooltipPopoverClassName)]}
            targetWrapperClassName={className}
            onClose={resetActionAndClosePopup}
            isOpened={isOpened}
            target={
                <button
                    data-test-key="open-menu-button"
                    aria-label={localize(i18n, 'trader.productsTable.showMore')}
                    type="button"
                    className={`
                        ${layout}
                        ${layoutWithDefaultIcon}
                        ${toggleIconWrapper}
                        ${isOpened ? activeButtonWithBackdrop : selectableButtonWithBackdrop}
                    `}
                    onClick={(event) => {
                        toggle();
                        onClick?.(event);
                    }}>
                    <Icon type="more_vert" className={icon} />
                </button>
            }>
            <div className={actionsMenu}>
                {selectedAction === ProductActionTypes.FAVOURITES ? (
                    <FavouriteProductSettings
                        productId={String(productId)}
                        onSave={resetActionAndClosePopup}
                        onClose={resetActionAndClosePopup}
                    />
                ) : (
                    <ProductActions productInfo={productInfo} onAction={handleAction} />
                )}
            </div>
        </Menu>
    );
});

ProductActionsButton.displayName = 'ProductActionsButton';
export default ProductActionsButton;
