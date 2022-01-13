import * as React from 'react';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductType} from 'frontend-core/dist/models/product-type';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {ConfigContext, CurrentClientContext} from '../../app-component/app-context';
import useLatestSearchedProducts from '../hooks/use-latest-searched-products';
import getProductsSearchProductTypes from '../../../services/product-type/get-products-search-product-types';
import useNavigationThroughElementsByKeys from '../../../hooks/use-navigation-through-elements-by-keys';
import {popup, productTypesNavigation} from './panel.css';
import ProductTypesNavigation from '../product-types-navigation';
import SearchResultsSection from './search-results-section';
import LatestSearchedProductsSection from './latest-searched-products-section';

interface Props {
    searchText: string;
    onProductTypeChange(productType: ProductType | undefined): void;
    productType: ProductType | undefined;
    products: ProductInfo[];
    onClose(): void;
}

enum Sections {
    LATEST_SEARCHED_PRODUCTS = 'LATEST_SEARCHED_PRODUCTS',
    SEARCH_RESULTS = 'SEARCH_RESULTS'
}

const {useRef, useContext, useMemo, forwardRef} = React;
const QuickSearchPopup = forwardRef<HTMLDivElement, Props>(
    ({searchText, onProductTypeChange, productType, products, onClose}, popupRef) => {
        const config = useContext(ConfigContext);
        const currentClient = useContext(CurrentClientContext);
        const {
            products: latestSearchedProducts,
            addProduct: addLatestSearchedProduct,
            deleteProduct: deleteLatestSearchedProduct,
            deleteAllProducts: deleteAllLatestSearchedProducts
        } = useLatestSearchedProducts();
        const section = useMemo<Sections | undefined>(() => {
            if (searchText) {
                return Sections.SEARCH_RESULTS;
            }

            if (latestSearchedProducts.length) {
                return Sections.LATEST_SEARCHED_PRODUCTS;
            }

            return undefined;
        }, [searchText, latestSearchedProducts]);
        const {value: productTypes = []} = useAsync(() => getProductsSearchProductTypes(config, currentClient), [
            config,
            currentClient
        ]);
        const rootRef = useRef<HTMLDivElement>(null);
        const mainRef: React.RefObject<HTMLDivElement> = (popupRef as React.RefObject<HTMLDivElement>) || rootRef;

        useNavigationThroughElementsByKeys(mainRef);

        return (
            <div ref={mainRef} role="dialog" className={popup}>
                {searchText && (
                    <ProductTypesNavigation
                        onSelect={onProductTypeChange}
                        productTypes={productTypes}
                        selectedProductType={productType}
                        compact={true}
                        className={productTypesNavigation}
                    />
                )}
                {section === Sections.SEARCH_RESULTS && (
                    <SearchResultsSection
                        searchText={searchText}
                        products={products}
                        productTypes={productTypes}
                        selectedProductType={productType}
                        onProductItemSelect={addLatestSearchedProduct}
                        onProductTradingButtonsClick={onClose}
                    />
                )}
                {section === Sections.LATEST_SEARCHED_PRODUCTS && (
                    <LatestSearchedProductsSection
                        products={latestSearchedProducts}
                        onItemDelete={deleteLatestSearchedProduct}
                        onAllItemsDelete={deleteAllLatestSearchedProducts}
                        onProductTradingButtonsClick={onClose}
                    />
                )}
            </div>
        );
    }
);

QuickSearchPopup.displayName = 'QuickSearchPopup';
export default QuickSearchPopup;
