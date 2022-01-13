import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {noneValueId} from 'frontend-core/dist/models/dictionary';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getEtfs, {ETFsRequestParams} from 'frontend-core/dist/services/products/etf/get-etfs';
import * as React from 'react';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {loading} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import ProductsTable, {Column} from '../../data-table/products-table';
import {cell, headerCell, inlineEndContentCell} from '../../table/table.css';
import {valuePlaceholder} from '../../value';
import useFullViewSearchParams from '../hooks/use-full-view-search-params';
import {ETFsSearchProps} from './search';
import {AppApiContext, ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import TableFooter from '../../data-table/table-footer';
import Card from '../../card';

type Align = 'left' | 'right';
const {useEffect, useMemo, useCallback, useContext} = React;
const ETFsSearchFullView: React.FunctionComponent<ETFsSearchProps> = ({searchParams, onData}) => {
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const {
        products,
        isLoading,
        error,
        pagination,
        handleSortChange,
        getOrderByValue,
        setPagination
    } = useFullViewSearchParams<ProductInfo, ETFsRequestParams>(
        (searchParams) => getEtfs(config, currentClient, searchParams),
        searchParams
    );
    const renderBodyCell = useCallback(
        (align: Align, field: keyof ProductInfo) => (productInfo: ProductInfo) => {
            const value = productInfo[field];

            return (
                <td
                    key={`${productInfo.id}${field}`}
                    className={`${cell} ${align === 'right' ? inlineEndContentCell : ''}`}>
                    {(value === noneValueId ? valuePlaceholder : value) ?? valuePlaceholder}
                </td>
            );
        },
        []
    );
    const renderHeaderCell = useCallback(
        (align: Align, field: keyof ProductInfo) => () => (
            <th key={field} className={`${headerCell} ${align === 'right' ? inlineEndContentCell : ''}`}>
                {localize(i18n, `trader.productsTable.${field}`)}
            </th>
        ),
        [i18n]
    );
    const tableViewColumns = useMemo<Column[]>(
        () => [
            'name',
            'symbolIsin',
            {field: 'exchange.hiqAbbr', sortableField: 'exchangeHiqAbbr'},
            'LastPrice.value',
            'AbsoluteDifference.value',
            'RelativeDifference.value',
            'CumulativeVolume.value',
            'CurrentClosePrice.value',
            'CombinedLastDateTime.value',
            {
                field: 'totalExpenseRatio',
                renderHeaderCell: renderHeaderCell('right', 'totalExpenseRatio'),
                renderBodyCell: renderBodyCell('right', 'totalExpenseRatio')
            },
            {
                field: 'region',
                renderHeaderCell: renderHeaderCell('left', 'region'),
                renderBodyCell: renderBodyCell('left', 'region')
            },
            'feedQuality'
        ],
        [renderHeaderCell]
    );

    useEffect(() => products && onData?.(products), [products, onData]);

    if (error) {
        logErrorLocally(error);
        app.openModal({error});
    }

    return (
        <Card
            innerHorizontalGap={false}
            footer={
                products &&
                isNonEmptyArray(products) && <TableFooter pagination={pagination} onPaginationChange={setPagination} />
            }>
            <div className={isLoading ? loading : undefined}>
                <ProductsTable
                    columns={tableViewColumns}
                    getOrderByValue={getOrderByValue}
                    products={products}
                    onSortChange={handleSortChange}
                />
            </div>
        </Card>
    );
};

export default React.memo(ETFsSearchFullView);
