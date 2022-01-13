import {RefObject} from 'react';
import useElementSize from 'frontend-core/dist/hooks/use-element-size';

interface ColumnOptions {
    maxWidth: number;
}

export type Column<ColumnsCount extends number> = [ColumnsCount, ColumnOptions];

// we should work only with non-empty list
export type ColumnsList<ColumnsCount extends number> = [Column<ColumnsCount>, ...Column<ColumnsCount>[]];

export default function useColumnsLayout<ColumnsCount extends number>(
    targetRef: RefObject<HTMLElement>,
    columns: ColumnsList<ColumnsCount>
): ColumnsCount | undefined {
    const size = useElementSize(targetRef);
    const column = size && columns.find(([_, options]) => options.maxWidth >= size.width);

    return column?.[0];
}
