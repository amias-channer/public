import {Pagination} from '../../models/pagination';

export default function setPageNumber(pagination: Pagination, pageNumber: number): Pagination {
    return {
        ...pagination,
        pageNumber
    };
}
