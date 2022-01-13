import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getLeveragedProducts, {
    LeveragedProductsRequestParams
} from 'frontend-core/dist/services/products/leveraged/get-leveraged-products';
import * as React from 'react';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {loading} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import ProductsTable, {Column} from '../../data-table/products-table';
import useFullViewSearchParams from '../hooks/use-full-view-search-params';
import {LeveragedsSearchProps} from './search';
import {AppApiContext, ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import TableFooter from '../../data-table/table-footer';
import TableHeadSortableColumn from '../../data-table/table-head-sortable-column';
import {inlineEndContentCell} from '../../table/table.css';
import Card from '../../card';
import Hint from '../../hint';

const {useEffect, useContext, useMemo} = React;
const LeveragedsSearchFullView: React.FunctionComponent<LeveragedsSearchProps> = ({searchParams, onData}) => {
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
    } = useFullViewSearchParams<ProductInfo, LeveragedProductsRequestParams>(
        (searchParams) => getLeveragedProducts(config, currentClient, searchParams),
        searchParams
    );
    const tableViewColumns = useMemo<Column[]>(
        () => [
            'name',
            'symbolIsin',
            'LastPrice.value',
            'AbsoluteDifference.value',
            'RelativeDifference.value',
            'BidPrice.value',
            'AskPrice.value',
            'stoploss',
            'leverage',
            {
                field: 'financingLevel',
                renderHeaderCell: () => {
                    const field = 'financingLevel';

                    return (
                        <TableHeadSortableColumn
                            key={field}
                            field={field}
                            value={getOrderByValue(field)}
                            className={inlineEndContentCell}
                            onToggle={handleSortChange}>
                            <span>{localize(i18n, 'trader.productsTable.financingLevelColumn')}</span>
                            <Hint
                                className={inlineRight}
                                content={localize(i18n, 'trader.productsTable.financingLevelHint')}
                            />
                        </TableHeadSortableColumn>
                    );
                },
                sortable: true
            },
            'CurrentClosePrice.value',
            'LowPrice.value',
            'HighPrice.value',
            'CombinedLastDateTime.value',
            'feedQuality'
        ],
        [i18n]
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
                    products={products}
                    columns={tableViewColumns}
                    getOrderByValue={getOrderByValue}
                    onSortChange={handleSortChange}
                />
            </div>
        </Card>
    );
};

export default React.memo(LeveragedsSearchFullView);
