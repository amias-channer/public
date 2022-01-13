import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import {SortTypes} from 'frontend-core/dist/services/filter';
import {ProductInfo} from 'frontend-core/dist/models/product';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import {I18nContext} from '../../app-component/app-context';
import SortableColumn from '../sortable-column';
import {productNameCell, startStickyCell, stickyCellContent} from '../../table/table.css';
import ProductNameCellContent from '../products-table/product-name-cell-content';
import {valuePlaceholder} from '../../value';
import ProductNameCellSkeleton from '../products-table/product-name-cell-skeleton';

interface Props<T extends any = any> {
    sortType: SortTypes;
    onSort?: (prop: SortTypes) => void;
    mapDataToProductInfo?: (data: T) => ProductInfo | undefined;
    children?: ((data: T) => React.ReactNode) | React.ReactNode;
}

const {useContext, useCallback, memo} = React;
const ProductNameColumn = memo<Props>(({children, sortType, onSort, mapDataToProductInfo}) => {
    const i18n = useContext(I18nContext);
    const stopEventOnSortableColumn = useCallback((_data, _index, event) => stopEvent(event), []);

    return (
        <SortableColumn
            sortType={sortType}
            onSort={onSort}
            onCellItemClick={stopEventOnSortableColumn}
            className={`${productNameCell} ${startStickyCell}`}
            header={localize(i18n, 'trader.productsTable.productNameColumn')}
            skeleton={<ProductNameCellSkeleton />}>
            {(data) => {
                const productInfo = mapDataToProductInfo?.(data) ?? data;

                return productInfo ? (
                    <div className={stickyCellContent}>
                        <ProductNameCellContent productInfo={productInfo}>
                            {typeof children === 'function' ? children(data) : children}
                        </ProductNameCellContent>
                    </div>
                ) : (
                    valuePlaceholder
                );
            }}
        </SortableColumn>
    );
});

ProductNameColumn.displayName = 'ProductNameColumn';
export default ProductNameColumn as <T extends any = any>(props: Props<T>) => JSX.Element;
