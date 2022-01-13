import createNumbersRange from 'frontend-core/dist/utils/range';

export interface RangeData {
    range: number[];
    separatorIndices: {[key: string]: boolean};
}

/**
 * [Range]
 * [LeftRange ... MiddleRange ... RightRange]
 * [LeftRange ... RightRange]
 * @param {{pagesCount: number, currentPage: number, groupSize: number}} props
 * @returns {{range: number[], separatorIndices: {} }}
 */
export default function createRange(props: {pagesCount: number; currentPage: number; groupSize: number}): RangeData {
    const {pagesCount, currentPage, groupSize} = props;
    const nextPage: number = currentPage + 1;
    const middleRangeStart: number = (nextPage > groupSize ? nextPage - groupSize : groupSize) + 1;
    const middleRangeEnd: number = nextPage > groupSize ? middleRangeStart + groupSize : middleRangeStart;
    /**
     * @description hide only 2+ pages under separator
     * @type {boolean}
     */
    const hasSeparatorBeforeCurrentPage: boolean = (middleRangeStart - 2) / groupSize >= 1;
    /**
     * @description hide only 2+ pages under separator and exclude the next page from range on the right side
     * @type {boolean}
     */
    const hasSeparatorAfterCurrentPage: boolean = pagesCount - middleRangeEnd >= groupSize + 2;
    const separatorIndices: {[key: string]: boolean} = {};
    const lastPageIndex: number = pagesCount - 1;
    let range: number[];

    // we have save the position for next page (1) + we should range only if we have more than 1 free element
    if (!hasSeparatorBeforeCurrentPage && !hasSeparatorAfterCurrentPage) {
        range = createNumbersRange(0, lastPageIndex);
    } else {
        let rangeSize;

        if (hasSeparatorBeforeCurrentPage || nextPage < groupSize) {
            rangeSize = groupSize;
            separatorIndices[rangeSize - 1] = true;
        } else {
            // include the next page to range
            rangeSize = middleRangeEnd;
        }

        range = createNumbersRange(0, rangeSize - 1);

        if (hasSeparatorBeforeCurrentPage && hasSeparatorAfterCurrentPage) {
            rangeSize = range.push.apply(range, createNumbersRange(middleRangeStart, middleRangeEnd - 1));
        }

        if (hasSeparatorAfterCurrentPage || pagesCount - nextPage < groupSize - 1) {
            if (hasSeparatorAfterCurrentPage) {
                separatorIndices[rangeSize - 1] = true;
            }

            range.push.apply(range, createNumbersRange(pagesCount - groupSize, lastPageIndex));
        } else {
            range.push.apply(range, createNumbersRange(middleRangeStart, lastPageIndex));
        }
    }

    return {
        range,
        separatorIndices
    };
}
