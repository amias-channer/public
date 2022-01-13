import {Pagination} from '../../models/pagination';

interface Options {
    skipFirstChunk?: boolean;
}

export default function isPaginationChunkStartIndex(index: number, pagination: Pagination, options?: Options): boolean {
    const {skipFirstChunk = true} = options || {};

    if (skipFirstChunk && index === 0) {
        return false;
    }

    return pagination.pageSize - pagination.pageSizeStep === index;
}
