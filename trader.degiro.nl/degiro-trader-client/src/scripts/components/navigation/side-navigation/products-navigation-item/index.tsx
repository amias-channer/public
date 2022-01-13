import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import localize from 'frontend-core/dist/services/i18n/localize';
import getLeveragedProductIssuers from 'frontend-core/dist/services/products/leveraged/get-leveraged-product-issuers';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Routes} from '../../../../navigation';
import getProductsSearchProductTypes from '../../../../services/product-type/get-products-search-product-types';
import getStocksNavigation from '../../../../services/products/stock/get-stocks-navigation';
import isProductsLinkActive from '../../../../services/router/is-products-link-active';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../../app-component/app-context';
import {
    activeNavigationItem,
    navigationItem,
    navigationItemIcon,
    navigationItemTitle,
    navigationItemToggleIcon,
    openedNavigationItem
} from '../side-navigation.css';
import SubmenuPanel, {SubmenuPanelProps} from './submenu-panel';
import SubmenuPanelContent from './submenu-panel/submenu-panel-content';

type MouseEventHandlerWrapper<T = Element, U = React.MouseEventHandler<T>> = (handler: U) => U;

const {useContext, useMemo, useCallback} = React;
const onTargetClick: MouseEventHandlerWrapper<HTMLAnchorElement> = (onClick) => (...params) => {
    deactivateActiveElement();
    onClick(...params);
};
const ProductsNavigationItem: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const location = useLocation();
    const isActive: boolean = useMemo(() => isProductsLinkActive(location), [location]);
    const {value: productTypes = []} = useAsync(() => getProductsSearchProductTypes(config, currentClient), [
        config,
        currentClient
    ]);
    const {value: stocksNavigation} = useAsync(() => getStocksNavigation(config, currentClient, i18n), [
        config,
        currentClient,
        i18n
    ]);
    const {value: leveragedProductIssuers = []} = useAsync(() => {
        return currentClient.canViewLeveragedProducts
            ? getLeveragedProductIssuers(config, i18n)
            : Promise.resolve(undefined);
    }, [config, currentClient, i18n]);
    const renderTarget = useCallback<SubmenuPanelProps['renderTarget']>(
        ({isOpened, open, close}) => (
            <Link
                data-name="productsMenuItem"
                data-active={isActive}
                to={`${Routes.PRODUCTS}?productType=${ProductTypeIds.STOCK}`}
                className={`${navigationItem} ${isActive ? activeNavigationItem : ''} ${
                    isOpened ? openedNavigationItem : ''
                }`}
                onClick={onTargetClick(close)}
                onFocus={open}>
                <Icon className={navigationItemIcon} type={isActive ? 'products' : 'products_outline'} />
                <span className={navigationItemTitle}>{localize(i18n, 'trader.navigation.products')}</span>
                <Icon className={navigationItemToggleIcon} type="arrow_drop_down" />
            </Link>
        ),
        [isActive, i18n]
    );

    return (
        <SubmenuPanel renderTarget={renderTarget}>
            {({close}) => (
                <SubmenuPanelContent
                    productTypes={productTypes}
                    stocksNavigation={stocksNavigation}
                    leveragedProductIssuers={leveragedProductIssuers}
                    onClose={close}
                />
            )}
        </SubmenuPanel>
    );
};

export default React.memo(ProductsNavigationItem);
