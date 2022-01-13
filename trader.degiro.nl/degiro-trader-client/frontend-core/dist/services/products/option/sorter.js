import getDictionary from '../../dictionary/get-dictionary';
import { SortTypes } from '../../filter/index';
import { ProductsSorter } from '../product/sorter';
export class OptionsSorter extends ProductsSorter {
    getDefaultSorterData() {
        return {
            sortColumns: ['expirationDate', 'strike'],
            sortTypes: [SortTypes.ASC, SortTypes.ASC]
        };
    }
    load(options) {
        return getDictionary(options.config).then(({ optionSortColumns }) => {
            this.setColumns(optionSortColumns || [], options);
            this.setDefaults(options);
        });
    }
}
//# sourceMappingURL=sorter.js.map