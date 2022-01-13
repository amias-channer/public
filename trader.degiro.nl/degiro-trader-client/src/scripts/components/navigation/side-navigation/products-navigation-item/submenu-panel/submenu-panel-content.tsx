import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {LeveragedProductIssuerItem} from 'frontend-core/dist/models/leveraged';
import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import localize from 'frontend-core/dist/services/i18n/localize';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {StocksNavigation} from '../../../../../models/stock';
import {I18nContext} from '../../../../app-component/app-context';
import useMenuKeyboardNavigation, {
    focusableElementsQuerySelector
} from '../../../../menu/hooks/use-menu-keyboard-navigation';
import LeveragedProductsPanel from './leveraged-products-panel';
import StocksPanel from './stocks-panel';
import SubmenuItemHoverOverlay from './submenu-item-hover-overlay';
import {
    productTypesListItem,
    productTypesSection,
    secondaryNavigationSection,
    selectedProductTypesListItem,
    submenuContent,
    submenuTitle
} from './submenu-panel.css';

interface Props {
    productTypes: ProductType[];
    stocksNavigation: StocksNavigation | undefined;
    leveragedProductIssuers: LeveragedProductIssuerItem[];
    onClose(): void;
}

const {useContext, useCallback, useState, useRef} = React;
const SubmenuPanelContent: React.FunctionComponent<Props> = ({
    productTypes,
    stocksNavigation,
    leveragedProductIssuers,
    onClose
}) => {
    const menuRef = useRef<HTMLUListElement>(null);
    const submenuRef = useRef<HTMLDivElement>(null);
    const selectedMenuItemRef = useRef<HTMLLIElement>(null);
    const i18n = useContext(I18nContext);
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<ProductTypeIds | undefined>();
    const onMenuItemClick = useCallback(() => onClose(), [onClose]);
    const onMenuItemKeyDown = useCallback((productTypeId: ProductTypeIds, event: React.KeyboardEvent<HTMLElement>) => {
        const {current: submenu} = submenuRef;

        if (event.key === 'ArrowRight' && document.activeElement === event.currentTarget) {
            stopEvent(event);

            if (submenu) {
                // focus the first item in submenu
                submenu.querySelector<HTMLElement>(focusableElementsQuerySelector)?.focus();
            } else {
                // open submenu
                setSelectedProductTypeId(productTypeId);
            }
        }
    }, []);
    const onSubmenuKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
        const {current: submenu} = submenuRef;
        const {current: selectedMenuItem} = selectedMenuItemRef;

        if (
            event.key === 'ArrowLeft' &&
            submenu &&
            selectedMenuItem &&
            document.activeElement === submenu.querySelector<HTMLElement>(focusableElementsQuerySelector)
        ) {
            stopEvent(event);
            // close submenu but focus its "parent" menu item
            selectedMenuItem.querySelector<HTMLElement>(focusableElementsQuerySelector)?.focus();
            setSelectedProductTypeId(undefined);
        }
    }, []);

    useMenuKeyboardNavigation(menuRef, true);

    return (
        <div className={submenuContent}>
            <section className={productTypesSection}>
                <h3 className={submenuTitle}>{localize(i18n, 'trader.navigation.products')}</h3>
                <ul role="menu" ref={menuRef}>
                    {productTypes.map(({id, translation}: ProductType) => {
                        const isSelected: boolean = selectedProductTypeId === id;
                        // this condition of product types with submenu can be extended in future
                        const hasSubMenu: boolean =
                            (id === ProductTypeIds.STOCK && stocksNavigation !== undefined) ||
                            (id === ProductTypeIds.LEVERAGED && isNonEmptyArray(leveragedProductIssuers));
                        const selectCurrentProductType = setSelectedProductTypeId.bind(null, id);

                        return (
                            <li key={String(id)} role="menuitem" ref={isSelected ? selectedMenuItemRef : undefined}>
                                <Link
                                    to={`${Routes.PRODUCTS}?productType=${id}`}
                                    onClick={onMenuItemClick}
                                    onFocus={selectCurrentProductType}
                                    onMouseOver={selectCurrentProductType}
                                    onKeyDown={hasSubMenu ? onMenuItemKeyDown.bind(null, id) : undefined}
                                    className={`${productTypesListItem} ${
                                        isSelected ? selectedProductTypesListItem : ''
                                    }`}>
                                    {localize(i18n, translation)}
                                    {hasSubMenu && <Icon type="keyboard_arrow_right" />}
                                    {isSelected && hasSubMenu && (
                                        <SubmenuItemHoverOverlay menuRef={menuRef} menuItemRef={selectedMenuItemRef} />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>
            {selectedProductTypeId === ProductTypeIds.STOCK && stocksNavigation && (
                <section ref={submenuRef} onKeyDown={onSubmenuKeyDown} className={secondaryNavigationSection}>
                    <StocksPanel stocksNavigation={stocksNavigation} onClose={onClose} />
                </section>
            )}
            {selectedProductTypeId === ProductTypeIds.LEVERAGED && isNonEmptyArray(leveragedProductIssuers) && (
                <section ref={submenuRef} onKeyDown={onSubmenuKeyDown} className={secondaryNavigationSection}>
                    <LeveragedProductsPanel issuers={leveragedProductIssuers} onClose={onClose} />
                </section>
            )}
        </div>
    );
};

export default React.memo(SubmenuPanelContent);
