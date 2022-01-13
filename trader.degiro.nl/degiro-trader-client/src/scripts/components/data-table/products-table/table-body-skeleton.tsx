import * as React from 'react';
import {Column} from './index';
import {dataPlaceholder, tableSkeleton} from './products-table.css';
import {
    cell,
    feedQualityCell,
    inlineEndContentCell,
    hoverableRow,
    productNameCell,
    startStickyCell,
    stickyCellContent
} from '../../table/table.css';
import {nbsp} from '../../value';
import ProductNameCellSkeleton from './product-name-cell-skeleton';

interface Props {
    columns: Column[];
    numberOfRows?: number;
}

const {memo} = React;
const TableBodySkeleton = memo<Props>(({columns, numberOfRows = 4}) => (
    <tbody className={tableSkeleton}>
        {Array(numberOfRows)
            .fill(null)
            .map((_, i) => (
                // eslint-disable-next-line react/forbid-dom-props
                <tr key={i} style={{opacity: Math.max(1 - i * 0.2, 0)}} className={hoverableRow}>
                    {columns.map((field, key) => {
                        if (typeof field !== 'string' && field.renderBodyCellSkeleton) {
                            return field.renderBodyCellSkeleton();
                        }

                        if (typeof field !== 'string') {
                            field = field.field;
                        }

                        switch (field) {
                            case 'name':
                                return (
                                    <td key={key} className={`${cell} ${startStickyCell} ${productNameCell}`}>
                                        <div className={stickyCellContent}>
                                            <ProductNameCellSkeleton />
                                        </div>
                                    </td>
                                );
                            case 'symbolIsin':
                                return (
                                    <td key={key} className={cell}>
                                        <span className={dataPlaceholder}>{''.padEnd(40, nbsp)}</span>
                                    </td>
                                );
                            case 'productType':
                            case 'currency':
                            case 'exchange.hiqAbbr':
                            case 'chart':
                                return (
                                    <td key={key} className={cell}>
                                        <span className={dataPlaceholder}>{''.padEnd(8, nbsp)}</span>
                                    </td>
                                );
                            case 'stoploss':
                            case 'financingLevel':
                            case 'LastPrice.value':
                            case 'leverage':
                            case 'AbsoluteDifference.value':
                            case 'RelativeDifference.value':
                            case 'BidPrice.value':
                            case 'LowPrice.value':
                            case 'CumulativeVolume.value':
                            case 'AskPrice.value':
                            case 'OpenPrice.value':
                            case 'HighPrice.value':
                            case 'CurrentClosePrice.value':
                            case 'CombinedLastDateTime.value':
                                return (
                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                        <span className={dataPlaceholder}>{''.padEnd(8, nbsp)}</span>
                                    </td>
                                );
                            case 'feedQuality':
                                return (
                                    <td key={key} className={`${cell} ${feedQualityCell}`}>
                                        <span className={dataPlaceholder}>{''.padEnd(4, nbsp)}</span>
                                    </td>
                                );
                            default:
                                return (
                                    <td className={cell}>
                                        <span className={dataPlaceholder}>{''.padEnd(4, nbsp)}</span>
                                    </td>
                                );
                        }
                    })}
                </tr>
            ))}
    </tbody>
));

TableBodySkeleton.displayName = 'TableBodySkeleton';
export default TableBodySkeleton;
