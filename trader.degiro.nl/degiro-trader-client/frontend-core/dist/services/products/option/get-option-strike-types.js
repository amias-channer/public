import { OptionStrikeTypeIds } from '../../../models/option';
import { filterOptionAllId } from '../../filter/index';
export default function getOptionStrikeTypes() {
    return Promise.resolve([
        {
            id: String(filterOptionAllId),
            translation: 'trader.productsTable.filters.all'
        },
        {
            id: OptionStrikeTypeIds.ACTIVE,
            translation: 'trader.optionsTable.strikeTypes.active'
        }
    ]);
}
//# sourceMappingURL=get-option-strike-types.js.map