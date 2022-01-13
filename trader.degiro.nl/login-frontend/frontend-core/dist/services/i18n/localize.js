import { DebuggingParams, DebuggingParamStates } from '../../models/platform';
import hasDebuggingParam from '../../platform/has-debugging-param';
const placeholderPattern = /{([^}]+)}/g;
let localize;
// disable translating
if (hasDebuggingParam(DebuggingParams.I18N, DebuggingParamStates.OFF)) {
    localize = (_i18n, translationCode) => translationCode;
}
else {
    localize = (i18n, translationCode, placeholders) => {
        const translation = i18n[translationCode] || translationCode;
        if (!placeholders || translation === translationCode) {
            return translation;
        }
        return translation.replace(placeholderPattern, (_, placeholderName) => {
            const placeholderValue = placeholders[placeholderName];
            return placeholderValue || placeholderValue === 0 ? String(placeholderValue) : '';
        });
    };
}
export default localize;
//# sourceMappingURL=localize.js.map