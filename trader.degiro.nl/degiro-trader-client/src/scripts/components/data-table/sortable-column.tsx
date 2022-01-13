import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {SortTypes} from 'frontend-core/dist/services/filter';
import * as React from 'react';
import Column, {CellAttrs, ColumnProps} from '../table/column';
import {
    sortableCell,
    sortableHeaderCellContent,
    sortedHeaderCell,
    sortIcon,
    unsortedHeaderCellToggle
} from '../table/table.css';
import getSortIconType from './get-sort-icon-type';

export interface SortProps {
    sortType: SortTypes;
    onSort?: (prop: SortTypes) => void;
}

type Props<T extends any = any> = Omit<ColumnProps<T>, 'onHeaderClick'> & SortProps;

const {useCallback, useMemo, memo} = React;
const SortableColumn = memo<Props>(({onSort, sortType, className, header, children, ...columnProps}) => {
    const onHeaderClick = useCallback(() => onSort?.(sortType === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC), [
        sortType,
        onSort
    ]);
    const isSorted: boolean = sortType !== SortTypes.UNSORTED;
    const headerCellAttrs = useMemo<CellAttrs>(
        () => ({
            className: `${sortableCell} ${isSorted ? sortedHeaderCell : ''}`,
            'aria-sort': sortType === SortTypes.ASC ? 'ascending' : sortType === SortTypes.DESC ? 'descending' : 'none'
        }),
        [sortType]
    );

    return (
        <Column
            {...columnProps}
            className={className}
            onHeaderClick={onHeaderClick}
            headerCellAttrs={headerCellAttrs}
            header={
                <button
                    type="button"
                    className={`${sortableHeaderCellContent} ${isSorted ? '' : unsortedHeaderCellToggle}`}>
                    {typeof header === 'function' ? header() : header}
                    <Icon className={sortIcon} type={getSortIconType(isSorted ? sortType : SortTypes.ASC)} />
                </button>
            }>
            {children}
        </Column>
    );
});

SortableColumn.displayName = 'SortableColumn';
export default SortableColumn as <T extends any = any>(props: Props<T>) => JSX.Element;
