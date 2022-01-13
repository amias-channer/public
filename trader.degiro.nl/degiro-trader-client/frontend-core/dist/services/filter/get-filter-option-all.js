import localize from '../i18n/localize';
import { filterOptionAllId, filterOptionAllLabel } from './index';
/**
 * @description Returns a new instance to prevent linking on the same object
 * @param {I18n} [i18n]
 * @returns {FilterOption}
 */
export default function getFilterOptionAll(i18n) {
    const label = i18n ? localize(i18n, filterOptionAllLabel) : filterOptionAllLabel;
    return {
        id: filterOptionAllId,
        label,
        name: label
    };
}
//# sourceMappingURL=get-filter-option-all.js.map