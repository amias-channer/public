import {Pagination} from '../../models/pagination';
import setPageNumber from './set-page-number';
import setPagesCount from './set-pages-count';

export default function setPageSize(pagination: Pagination, pageSize: number): Pagination {
    let newPagination: Pagination = {
        ...pagination,
        pageSize
    } as const;

    // [WF-1493]
    newPagination = setPageNumber(newPagination, 0);
    newPagination = setPagesCount(newPagination);
    return newPagination;
}
