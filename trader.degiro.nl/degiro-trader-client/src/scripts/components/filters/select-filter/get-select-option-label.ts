import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import {SelectFilterValue} from '.';
import {MultiSelectFilterValue} from '../multi-select-filter';

export default function getSelectOptionLabel(
    i18n: I18n,
    {label, translation, name}: SelectFilterValue | MultiSelectFilterValue
): string {
    return String(label || (translation && localize(i18n, translation)) || name);
}
