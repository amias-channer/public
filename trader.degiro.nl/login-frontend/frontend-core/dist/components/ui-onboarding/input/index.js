import * as React from 'react';
import localize from '../../../services/i18n/localize';
import generateElementId from '../../ui-common/component/generate-element-id';
import { errorHint, input as inputStyle, inputHint, inputWithError, inputWrapper, label as labelStyle, layout } from './input.css';
import nbsp from '../../ui-common/component/nbsp';
const { useCallback, useMemo } = React;
const Input = ({ id: propId, type = 'text', className = '', label = nbsp(), fieldClassName = '', error, i18n, hint, scrollOnFocus = false, onFocus: propsOnFocus, ...inputProps }) => {
    const id = useMemo(() => String(propId || generateElementId()), [propId]);
    const errorMessage = error && error.text && localize(i18n, error.text);
    const onFocus = useCallback((event) => {
        const { currentTarget } = event;
        currentTarget.scrollIntoView(true);
        propsOnFocus === null || propsOnFocus === void 0 ? void 0 : propsOnFocus(event);
    }, [propsOnFocus]);
    return (React.createElement("div", { className: `${layout} ${className}` },
        React.createElement("label", { htmlFor: id, className: labelStyle }, label),
        React.createElement("div", { className: inputWrapper },
            React.createElement("input", { ...inputProps, id: id, type: type, onFocus: scrollOnFocus ? onFocus : propsOnFocus, className: `
                        ${inputStyle}
                        ${fieldClassName}
                        ${error ? inputWithError : ''}        
                    ` })),
        hint && !errorMessage && (React.createElement("div", { "data-name": "inputHint", className: inputHint }, hint)),
        errorMessage && (React.createElement("div", { "data-name": "inputError", className: errorHint }, errorMessage))));
};
export default React.memo(Input);
//# sourceMappingURL=index.js.map