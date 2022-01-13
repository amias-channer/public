import {RatioItem, RatiosGroup} from '../../models/refinitiv-company-profile';

export default function getRatioItemsFromRatiosGroups(...ratiosGroupsItems: RatiosGroup[][]): RatioItem[] {
    const ratiosItems: RatioItem[] = [];

    ratiosGroupsItems.forEach((ratiosGroupItem: RatiosGroup[]) => {
        ratiosGroupItem.forEach((groupItem: RatiosGroup) => {
            ratiosItems.push(...groupItem.items);
        });
    });

    return ratiosItems;
}
