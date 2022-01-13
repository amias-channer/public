import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {activeButtonWithBackdrop, selectableButtonWithBackdrop} from '../../button/button.css';
import {icon, layout, layoutWithDefaultIcon} from '../../hint/hint.css';
import Menu, {MenuProps} from '../../menu';
import {actionsMenu} from '../../menu/actions-menu.css';
import FavouriteProductIcon from '../favourite-product-icon';
import useFavouriteLists from '../hooks/use-favourite-lists';
import {loading, toggleIconWrapper} from './favourite-action-menu.css';

const FavouriteProductSettings = createLazyComponent(
    () => import(/* webpackChunkName: "favourite-product-settings" */ '../favourite-product-settings')
);

export type FavouriteActionMenuTargetRenderer = (props: {
    isFavouriteProduct: boolean;
    isOpened: boolean;
    onClick: React.MouseEventHandler<HTMLElement>;
}) => MenuProps['target'];
export type FavouriteActionMenuProps = Pick<MenuProps, 'horizontalPosition' | 'verticalPosition'> & {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onClose?: () => void;
    productInfo: ProductInfo;
    renderTarget?: FavouriteActionMenuTargetRenderer;
};

const {useMemo, useCallback, useContext, memo} = React;
const FavouriteActionMenu = memo<FavouriteActionMenuProps>(
    ({className = '', horizontalPosition, verticalPosition, onClick, onClose, productInfo, renderTarget}) => {
        const i18n = useContext(I18nContext);
        const {id: productId} = productInfo;
        const {isOpened, close, toggle} = useToggle();
        const {value: favouriteLists} = useFavouriteLists();
        const isFavouriteProduct = useMemo<boolean>(
            () => Boolean(favouriteLists?.some(({productIds}) => productIds.includes(String(productId)))),
            [favouriteLists, productId]
        );
        const handleClose = useCallback(() => {
            close();
            onClose?.();
        }, [onClose, close]);
        const onTargetClick = useCallback<React.MouseEventHandler<HTMLElement>>(
            (event) => {
                toggle();
                onClick?.(event);
            },
            [onClick, toggle]
        );

        if (!favouriteLists) {
            return <FavouriteProductIcon className={`${layout} ${toggleIconWrapper} ${loading}`} active={false} />;
        }

        return (
            <Menu
                isOpened={isOpened}
                horizontalPosition={horizontalPosition}
                verticalPosition={verticalPosition}
                onClose={handleClose}
                target={
                    renderTarget ? (
                        renderTarget({isFavouriteProduct, isOpened, onClick: onTargetClick})
                    ) : (
                        <button
                            aria-label={localize(i18n, 'trader.navigation.favourites')}
                            type="button"
                            className={`
                                ${layout}
                                ${layoutWithDefaultIcon}
                                ${toggleIconWrapper}
                                ${isOpened ? activeButtonWithBackdrop : selectableButtonWithBackdrop}
                            `}
                            onClick={onTargetClick}>
                            <FavouriteProductIcon className={icon} active={isFavouriteProduct} />
                        </button>
                    )
                }
                targetWrapperClassName={className}>
                <div className={actionsMenu}>
                    {favouriteLists && (
                        <FavouriteProductSettings
                            productId={String(productId)}
                            onSave={handleClose}
                            onClose={handleClose}
                        />
                    )}
                </div>
            </Menu>
        );
    }
);

FavouriteActionMenu.displayName = 'FavouriteActionMenu';
export default FavouriteActionMenu;
