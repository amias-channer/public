import {Pagination} from '../../models/pagination';
import setPageNumber from './set-page-number';
import setPagesCount from './set-pages-count';

export default function setTotalSize(pagination: Pagination, totalSize: number): Pagination {
    let newPagination: Pagination = {
        ...pagination,
        totalSize
    } as const;

    newPagination = setPageNumber(newPagination, 0);
    newPagination = setPagesCount(newPagination);
    return newPagination;
}
