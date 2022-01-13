import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {secondaryActionIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {filterOptionAllId} from 'frontend-core/dist/services/filter';
import localize from 'frontend-core/dist/services/i18n/localize';
import keyBy from 'frontend-core/dist/utils/key-by';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Routes} from '../../../navigation';
import {I18nContext} from '../../app-component/app-context';
import {listDivider, listDividerTitle, emptyResultsMessage, allSearchResultsButton} from './panel.css';
import ProductsListItem from './products-list-item';
import {SearchHighlightContext} from '../../search-highlight';

interface Props {
    products: ProductInfo[];
    productTypes: ProductType[];
    selectedProductType: ProductType | undefined;
    searchText: string;
    onProductItemSelect(productInfo: ProductInfo): void;
    onProductTradingButtonsClick(event: React.MouseEvent<HTMLElement>): void;
}

const {useMemo, useContext} = React;
const SearchResultsSection: React.FunctionComponent<Props> = ({
    products,
    productTypes,
    searchText,
    selectedProductType,
    onProductItemSelect,
    onProductTradingButtonsClick
}) => {
    const i18n = useContext(I18nContext);
    const productTypesById: Record<string, ProductType> = useMemo(() => keyBy(productTypes, 'id'), [productTypes]);

    if (!products.length) {
        return (
            <div data-name="emptyResults" className={emptyResultsMessage}>
                {localize(i18n, 'trader.productsSearch.noData')}
            </div>
        );
    }

    return (
        <SearchHighlightContext.Provider value={searchText}>
            {selectedProductType && (
                <Link
                    className={allSearchResultsButton}
                    to={`${Routes.PRODUCTS}?${getQueryString({
                        productType: selectedProductType.id,
                        searchText,
                        ...(selectedProductType.id === ProductTypeIds.STOCK
                            ? {country: filterOptionAllId, stockList: filterOptionAllId, stockListType: 'index'}
                            : {})
                    })}`}>
                    <span>
                        {localize(i18n, 'trader.productsSearch.allResultsByProductType', {
                            productType: localize(i18n, selectedProductType.translation)
                        })}
                    </span>
                    <Icon className={secondaryActionIcon} type="keyboard_arrow_right" />
                </Link>
            )}
            {products.map((productInfo: ProductInfo, index: number, products: ProductInfo[]) => {
                const {productTypeId} = productInfo;
                const prevProductInfo: ProductInfo | undefined = products[index - 1];
                const prevProductType: ProductType | undefined = productTypesById[prevProductInfo?.productTypeId];
                const productType: ProductType | undefined = productTypesById[productTypeId];

                return (
                    <React.Fragment key={String(productInfo.id)}>
                        {productType && productTypeId !== prevProductType?.id && (
                            <div className={listDivider}>
                                <span data-name="productType" data-id={productTypeId} className={listDividerTitle}>
                                    {selectedProductType
                                        ? localize(i18n, 'trader.productsSearch.topResults')
                                        : localize(i18n, productType.translation)}
                                </span>
                            </div>
                        )}
                        <ProductsListItem
                            productInfo={productInfo}
                            onClick={onProductItemSelect.bind(null, productInfo)}
                            onTradingButtonsClick={onProductTradingButtonsClick}
                        />
                    </React.Fragment>
                );
            })}
        </SearchHighlightContext.Provider>
    );
};

export default React.memo(SearchResultsSection);
