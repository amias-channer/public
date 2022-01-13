import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import FeedQualityIcon from '../../feed-quality/icon';
import {
    exchangeCell,
    feedQualityCell,
    headerCell,
    inlineEndContentCell,
    productNameCell,
    row,
    startStickyCell
} from '../../table/table.css';
import TableHeadSortableColumn from '../table-head-sortable-column';
import {Column, ColumnDescription, ProductsTableViewProps} from './index';

type ProductsTableHeadProps = Pick<ProductsTableViewProps, 'columns' | 'getOrderByValue' | 'onSortChange'>;

const {useContext, memo} = React;
const ProductsTableHead = memo<ProductsTableHeadProps>(({columns, getOrderByValue, onSortChange}) => {
    const i18n = useContext(I18nContext);

    return (
        <thead>
            <tr className={row}>
                {columns.map((column: Column) => {
                    const {renderHeaderCell} = column as ColumnDescription;

                    if (renderHeaderCell) {
                        return renderHeaderCell();
                    }

                    let columnField: string;
                    let isSortableColumn: boolean | undefined;
                    let className: string = '';
                    let content: React.ReactNode;
                    let sortableField: string;

                    if (typeof column === 'string') {
                        columnField = column;
                        sortableField = column;
                    } else {
                        columnField = column.field;
                        sortableField = column.sortableField || columnField;
                        isSortableColumn = column.sortable;
                    }

                    switch (columnField) {
                        case 'name':
                            isSortableColumn = isSortableColumn ?? true;
                            className = `${productNameCell} ${startStickyCell}`;
                            content = localize(i18n, 'trader.productsTable.productNameColumn');
                            break;
                        case 'currency':
                            content = localize(i18n, 'trader.productsTable.currencyColumn');
                            break;
                        case 'symbolIsin':
                            content = localize(i18n, 'trader.productsTable.isinSymbolColumn');
                            break;
                        case 'productType':
                            isSortableColumn = isSortableColumn ?? true;
                            content = localize(i18n, 'trader.productsTable.productTypeColumn');
                            break;
                        case 'exchange.hiqAbbr':
                            // [TRADER-2492] make Exchange column sortable by default once BE sorting is fixed
                            isSortableColumn = isSortableColumn ?? false;
                            className = exchangeCell;
                            content = localize(i18n, 'trader.productDetails.exchange');
                            break;
                        case 'stoploss':
                            isSortableColumn = isSortableColumn ?? true;
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productsTable.stopLossColumn');
                            break;
                        case 'leverage':
                            isSortableColumn = isSortableColumn ?? true;
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productsTable.leverageColumn');
                            break;
                        case 'financingLevel':
                            isSortableColumn = isSortableColumn ?? true;
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productsTable.financingLevelColumn');
                            break;
                        case 'LastPrice.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.lastPrice');
                            break;
                        case 'AbsoluteDifference.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.absoluteDifference');
                            break;
                        case 'RelativeDifference.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.relativeDifference');
                            break;
                        case 'BidPrice.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.bidPrice');
                            break;
                        case 'AskPrice.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.askPrice');
                            break;
                        case 'CumulativeVolume.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.volume');
                            break;
                        case 'LowPrice.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.lowPrice');
                            break;
                        case 'OpenPrice.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.openPrice');
                            break;
                        case 'HighPrice.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.highPrice');
                            break;
                        case 'CurrentClosePrice.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.closePrice');
                            break;
                        case 'CombinedLastDateTime.value':
                            className = inlineEndContentCell;
                            content = localize(i18n, 'trader.productDetails.lastUpdate');
                            break;
                        case 'feedQuality':
                            className = feedQualityCell;
                            content = <FeedQualityIcon />;
                            break;
                        case 'chart':
                            content = localize(i18n, 'trader.productDetails.performanceChart');
                            break;
                        default:
                            return null;
                    }

                    if (isSortableColumn) {
                        return (
                            <TableHeadSortableColumn
                                key={sortableField}
                                field={sortableField}
                                value={getOrderByValue(sortableField)}
                                className={className}
                                onToggle={onSortChange}>
                                {content}
                            </TableHeadSortableColumn>
                        );
                    }

                    return (
                        <th key={columnField} className={`${headerCell} ${className}`}>
                            {content}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
});

ProductsTableHead.displayName = 'ProductsTableHead';
export default ProductsTableHead;
