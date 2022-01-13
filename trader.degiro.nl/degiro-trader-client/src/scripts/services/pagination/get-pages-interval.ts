import {Interval} from 'frontend-core/dist/models/interval';
import {Pagination} from '../../models/pagination';
import getPagesSize from './get-pages-size';

export default function getPagesInterval(pagination: Pagination): Interval<number> {
    const {pageSize, pageNumber} = pagination;

    return {
        start: pageNumber * pageSize,
        end: getPagesSize(pagination)
    };
}
