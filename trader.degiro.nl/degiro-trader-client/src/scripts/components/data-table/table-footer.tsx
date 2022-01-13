import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {defaultPageSizes, Pagination} from '../../models/pagination';
import setPageNumber from '../../services/pagination/set-page-number';
import setPageSize from '../../services/pagination/set-page-size';
import {I18nContext} from '../app-component/app-context';
import PageSizeSelector from '../page-size-selector/index';
import PaginationButtons from '../pagination-buttons/index';
import {
    footerPageSizeSelector,
    footerPageSizeSelectorLabel,
    footerPageSizeSelectorLayout,
    tableFooter
} from '../table/table.css';

export interface TableFooterProps {
    pagination: Pagination;
    pageSizes?: number[];
    groupSize?: number;
    hidePageSize?: boolean;
    className?: string;
    onPaginationChange(pagination: Pagination): void;
}

const {useContext} = React;
const TableFooter = React.memo<TableFooterProps>(
    ({pagination, pageSizes = defaultPageSizes, groupSize, className = '', hidePageSize, onPaginationChange}) => {
        const i18n = useContext(I18nContext);
        const onPageSizeChange = (pageSize: number) => onPaginationChange(setPageSize(pagination, pageSize));
        const onPageNumberChange = (pageNumber: number) => onPaginationChange(setPageNumber(pagination, pageNumber));
        const {totalSize, pagesCount} = pagination;
        const hidePageSizeSelector: boolean = hidePageSize || totalSize < pageSizes[0];

        return (
            <div className={`${tableFooter} ${className}`}>
                <PaginationButtons
                    pagesCount={pagesCount}
                    pageNumber={pagination.pageNumber}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={onPageNumberChange}
                    groupSize={groupSize}
                />
                {!hidePageSizeSelector && (
                    <div className={footerPageSizeSelectorLayout}>
                        <span className={footerPageSizeSelectorLabel}>
                            {localize(i18n, 'trader.pagination.resultsPerPage')}
                        </span>
                        <PageSizeSelector
                            className={footerPageSizeSelector}
                            pageSize={pagination.pageSize}
                            options={pageSizes}
                            // eslint-disable-next-line react/jsx-no-bind
                            onChange={onPageSizeChange}
                        />
                    </div>
                )}
            </div>
        );
    }
);

TableFooter.displayName = 'TableFooter';
export default TableFooter;
