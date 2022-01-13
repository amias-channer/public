import { OptionTypeIds } from '../../../models/option';
import { filterOptionAllId } from '../../filter/index';
export default function getOptionTypes() {
    return Promise.resolve([
        {
            id: String(filterOptionAllId),
            translation: 'combi.calls.puts'
        },
        {
            id: OptionTypeIds.CALL,
            translation: 'combi.calls'
        },
        {
            id: OptionTypeIds.PUT,
            translation: 'combi.puts'
        }
    ]);
}
//# sourceMappingURL=get-option-types.js.map