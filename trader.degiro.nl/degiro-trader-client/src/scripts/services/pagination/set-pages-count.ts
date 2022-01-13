import {Pagination} from '../../models/pagination';

export default function setPagesCount(pagination: Pagination): Pagination {
    const {pageSize, totalSize} = pagination;

    return {
        ...pagination,
        pagesCount: pageSize >= 1 && totalSize ? Math.ceil(totalSize / pageSize) : 1
    };
}
