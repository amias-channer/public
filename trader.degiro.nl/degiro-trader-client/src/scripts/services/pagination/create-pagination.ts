import {defaultPageSize, Pagination} from '../../models/pagination';
import setPageNumber from './set-page-number';
import setPageSize from './set-page-size';
import setTotalSize from './set-total-size';

export default function createPagination(props: Partial<Pagination> = {}): Pagination {
    let pagination: Pagination = {
        pageSize: 0,
        pageSizeStep: props.pageSizeStep || defaultPageSize,
        pageNumber: 0,
        totalSize: 0,
        pagesCount: 0
    } as const;
    const pageNumber: number = props.pageNumber || 0;

    pagination = setPageSize(pagination, props.pageSize || defaultPageSize);
    pagination = setTotalSize(pagination, props.totalSize || 0);

    if (pageNumber && pageNumber < pagination.pagesCount) {
        pagination = setPageNumber(pagination, pageNumber);
    }

    return pagination;
}
