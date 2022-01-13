import {RatioItem} from '../../models/refinitiv-company-profile';

export default function aggregateRatios<T extends keyof any>(
    ratioItems: RatioItem[],
    ids: readonly T[]
): {[P in T]?: string} {
    const ratios: Partial<Record<T, string>> = {};

    ratioItems.forEach((ratioItem: RatioItem) => {
        const ratioItemId = ratioItem.id as T;

        if (ids.includes(ratioItemId)) {
            ratios[ratioItemId] = ratioItem.value;
        }
    });

    return ratios;
}
