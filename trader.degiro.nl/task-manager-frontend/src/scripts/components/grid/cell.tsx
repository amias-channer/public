import * as React from 'react';
import * as gridStyles from './grid.css';

export interface CellProps extends React.HTMLProps<HTMLDivElement> {
    className?: string;
    align?: 'center' | 'right';
    children?: React.ReactNode | React.ReactNode[];
    size?: number;
    smallSize?: number;
    mediumSize?: number;
}

const cellSizeClasses: {[key: string]: string} = {
    1: gridStyles.cell1,
    2: gridStyles.cell2,
    3: gridStyles.cell3,
    4: gridStyles.cell4,
    5: gridStyles.cell5,
    6: gridStyles.cell6,
    7: gridStyles.cell7,
    8: gridStyles.cell8,
    9: gridStyles.cell9,
    10: gridStyles.cell10,
    11: gridStyles.cell11,
    12: gridStyles.cell12
};
const cellSmallSizeClasses: {[key: string]: string} = {
    1: gridStyles.cell1Small,
    2: gridStyles.cell2Small,
    3: gridStyles.cell3Small,
    4: gridStyles.cell4Small
};
const cellMediumSizeClasses: {[key: string]: string} = {
    1: gridStyles.cell1Medium,
    2: gridStyles.cell2Medium,
    3: gridStyles.cell3Medium,
    4: gridStyles.cell4Medium,
    5: gridStyles.cell5Medium,
    6: gridStyles.cell6Medium,
    7: gridStyles.cell7Medium,
    8: gridStyles.cell8Medium
};
const Cell: React.FunctionComponent<CellProps> = ({
    align,
    size,
    smallSize,
    mediumSize,
    children,
    className: additionalClassName = '',
    ...elementProps
}) => {
    const className: string = [
        gridStyles.cell,
        align === 'center' ? gridStyles.cellCenter : align === 'right' ? gridStyles.cellRight : '',
        cellSizeClasses[size as number] || '',
        cellSmallSizeClasses[smallSize as number] || '',
        cellMediumSizeClasses[mediumSize as number] || '',
        additionalClassName
    ].join(' ');

    return (
        <div {...elementProps} className={className}>
            {children}
        </div>
    );
};

export default React.memo<React.PropsWithChildren<CellProps>>(Cell);
