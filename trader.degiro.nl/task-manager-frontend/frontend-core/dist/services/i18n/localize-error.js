import { AppError } from '../../models/app-error';
import localize from './localize';
export default function localizeError(i18n, error) {
    return error && new AppError({ ...error, text: localize(i18n, error.text) });
}
//# sourceMappingURL=localize-error.js.map