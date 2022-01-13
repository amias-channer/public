import {IconType} from 'frontend-core/dist/components/ui-trader4/icon';
import {SortTypes} from 'frontend-core/dist/services/filter';

export default function getSortIconType(sortType: SortTypes): IconType {
    if (sortType === SortTypes.UNSORTED) {
        return 'empty';
    }

    if (sortType === SortTypes.ASC) {
        return 'arrow_up';
    }

    return 'arrow_down';
}
