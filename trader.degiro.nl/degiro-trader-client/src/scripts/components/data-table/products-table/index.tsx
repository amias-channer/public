import {ProductInfo} from 'frontend-core/dist/models/product';
import * as React from 'react';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {stickyCellTableWrapper, table as tableClassName} from '../../table/table.css';
import {TableHeadSortableColumnProps} from '../table-head-sortable-column';
import ProductsTableBody from './body';
import ProductsTableHead from './header';
import TableBodySkeleton from './table-body-skeleton';
import EmptyTableBody from './empty-table-body';

export interface ColumnDescription {
    field: string;
    sortable?: boolean;
    sortableField?: string;
    renderBodyCell?: (tableItem: ProductInfo) => React.ReactNode;
    renderHeaderCell?: () => React.ReactNode;
    renderBodyCellSkeleton?: () => React.ReactNode;
}

export type Column = string | ColumnDescription;

export interface ProductsTableViewProps {
    columns: Column[];
    products: ProductInfo[] | undefined;
    getOrderByValue(field: string): string;
    selectedItems?: string[];
    onSortChange?: TableHeadSortableColumnProps['onToggle'];
}
const {memo} = React;
const ProductsTable = memo<ProductsTableViewProps>(
    ({products, columns, getOrderByValue, onSortChange, selectedItems}) => (
        <div className={stickyCellTableWrapper}>
            <table className={tableClassName}>
                <ProductsTableHead columns={columns} getOrderByValue={getOrderByValue} onSortChange={onSortChange} />
                {products === undefined && <TableBodySkeleton columns={columns} />}
                {products && !isNonEmptyArray(products) && <EmptyTableBody columnsCount={columns.length} />}
                {isNonEmptyArray(products) && (
                    <ProductsTableBody products={products} columns={columns} selectedItems={selectedItems} />
                )}
            </table>
        </div>
    )
);

ProductsTable.displayName = 'ProductsTable';
export default ProductsTable;
