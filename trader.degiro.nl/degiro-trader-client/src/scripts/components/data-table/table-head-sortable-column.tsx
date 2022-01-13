import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {
    headerCell,
    sortableCell,
    sortableHeaderCellContent,
    sortedHeaderCell,
    sortIcon,
    unsortedHeaderCellToggle
} from '../table/table.css';

export type TableHeadSortableColumnProps = React.PropsWithChildren<{
    field: string;
    value: string;
    className?: string;
    onToggle?: (orderBy: string, field: string) => void;
}>;

const {memo} = React;
/**
 * @deprecated Use <SortableColumn> instead
 */
const TableHeadSortableColumn = memo<TableHeadSortableColumnProps>(
    ({value, field, className = '', onToggle, children}) => {
        const ascField: string = `+${field}`;
        const descField: string = `-${field}`;
        const isSorted: boolean = value === ascField || value === descField;

        return (
            <th
                data-field={field}
                aria-sort={value === ascField ? 'ascending' : value === descField ? 'descending' : 'none'}
                className={`
                    ${headerCell} 
                    ${sortableCell} 
                    ${className}
                    ${isSorted ? sortedHeaderCell : ''}
                `}
                onClick={onToggle?.bind(null, value === ascField ? descField : ascField, field)}>
                <button
                    type="button"
                    className={`${sortableHeaderCellContent} ${isSorted ? '' : unsortedHeaderCellToggle}`}>
                    {children}
                    <Icon className={sortIcon} type={value === descField ? 'arrow_down' : 'arrow_up'} />
                </button>
            </th>
        );
    }
);

TableHeadSortableColumn.displayName = 'TableHeadSortableColumn';
export default TableHeadSortableColumn;
