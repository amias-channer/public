import {Pagination} from '../../models/pagination';

export default function getPagesSize(pagination: Pagination): number {
    return pagination.pageSize * (pagination.pageNumber + 1);
}
