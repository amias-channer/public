import * as React from 'react';
import {cell as cellClassName, headerCell} from '../table/table.css';
import {DataContext, IndexContext, tableFakeData} from './index';
import {dataPlaceholder} from '../data-table/products-table/products-table.css';
import {nbsp} from '../value';

export type CellAttrs = React.HTMLAttributes<HTMLTableCellElement>;

export interface ColumnProps<T extends any = any> {
    header: React.ReactNode | (() => React.ReactNode);
    children: React.ReactNode | ((dataItem: T, index: number) => React.ReactNode);
    skeleton?: React.ReactNode | (() => React.ReactNode);
    headerCellAttrs?: CellAttrs;
    onHeaderClick?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
    onCellItemClick?: (dataItem: T, i: number, event: React.MouseEvent<HTMLTableCellElement>) => void;
    headerCellRef?: React.RefObject<HTMLTableHeaderCellElement>;
    className?: string;
}

const {useContext, useCallback} = React;
const Column = React.memo<ColumnProps>(
    ({
        header,
        children,
        skeleton = <span className={dataPlaceholder}>{''.padEnd(4, nbsp)}</span>,
        className = '',
        onHeaderClick,
        onCellItemClick,
        headerCellRef,
        headerCellAttrs,
        ...domProps
    }) => {
        const data: any[] | null = useContext(DataContext);
        const index: number | null = useContext(IndexContext);
        const onCellClickHandler = useCallback(
            (event: React.MouseEvent<HTMLTableCellElement>) => {
                if (data !== null && index !== null && onCellItemClick) {
                    onCellItemClick(data[index], index, event);
                }
            },
            [onCellItemClick, data, index]
        );

        if (index === null || data === null) {
            return (
                <th
                    {...headerCellAttrs}
                    onClick={onHeaderClick}
                    className={`${headerCell} ${className} ${headerCellAttrs?.className || ''}`}
                    ref={headerCellRef}>
                    {typeof header === 'function' ? header() : header}
                </th>
            );
        }

        if (data[index] === tableFakeData) {
            return (
                <td onClick={onCellClickHandler} className={`${cellClassName} ${className}`} {...domProps}>
                    {typeof skeleton === 'function' ? (skeleton as Function)() : skeleton}
                </td>
            );
        }

        return (
            <td onClick={onCellClickHandler} className={`${cellClassName} ${className}`} {...domProps}>
                {typeof children === 'function' ? (children as Function)(data[index], index) : children}
            </td>
        );
    }
);

Column.displayName = 'Column';
export default Column as <T extends any = any>(props: ColumnProps<T>) => JSX.Element;
