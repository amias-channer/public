import * as React from 'react';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {row, table as tableClassName} from './table.css';
import EmptyTableBody from '../data-table/products-table/empty-table-body';

export const DataContext = React.createContext<any[] | null>(null);
export const IndexContext = React.createContext<number | null>(null);

type TableChild = React.ReactElement;

interface TableProps<T = any> {
    data: T[] | undefined;
    children: TableChild | TableChild[];
    className?: string;
    onRowItemClick?: (dataItem: T, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
    getRowKey?: (dataItem: T, index: number) => string | number;
    getRowClassName?: (dataItem: T, index: number) => string;
}
export const tableFakeData = Symbol('tableFakeData');
const {useCallback, memo} = React;
const Table = memo<TableProps>(
    ({
        children,
        data,
        className = '',
        onRowItemClick = () => undefined,
        getRowClassName = () => '',
        getRowKey = (dataItem, index: number) => `row-${dataItem?.id ?? index}`
    }) => {
        const handleOnRowItemClick = useCallback(
            (event: React.MouseEvent<HTMLTableRowElement>) => {
                const rowIndex: number = Number(event.currentTarget.dataset.rowIndex);

                onRowItemClick?.((data as any[])[rowIndex], rowIndex, event);
            },
            [data, onRowItemClick]
        );
        const dataToRender = data || Array(4).fill(tableFakeData);

        return (
            <table className={`${tableClassName} ${className}`}>
                <thead>
                    <tr className={row}>{children}</tr>
                </thead>
                <tbody>
                    <DataContext.Provider value={dataToRender}>
                        {dataToRender.map((item, i) => {
                            const key: string = String(getRowKey(item, i));

                            return (
                                <IndexContext.Provider key={key} value={i}>
                                    <tr
                                        data-id={key}
                                        data-row-index={i}
                                        className={`${row} ${getRowClassName(item, i)}`}
                                        // eslint-disable-next-line react/forbid-dom-props
                                        style={item === tableFakeData ? {opacity: Math.max(1 - 0.2 * i, 0)} : undefined}
                                        onClick={item !== tableFakeData ? handleOnRowItemClick : undefined}>
                                        {React.Children.map(children, (child: TableChild) => React.cloneElement(child))}
                                    </tr>
                                </IndexContext.Provider>
                            );
                        })}
                    </DataContext.Provider>
                </tbody>
                {dataToRender && !isNonEmptyArray(dataToRender) && (
                    <EmptyTableBody columnsCount={Array.isArray(children) ? children.length : 1} />
                )}
            </table>
        );
    }
);

Table.displayName = 'Table';
export default Table;
