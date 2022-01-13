import * as React from 'react';
import localize from '../../../../services/i18n/localize';
import generateElementId from '../../../ui-common/component/generate-element-id';
import Icon from '../../../ui-common/icon/index';
import { errorHint, input as inputStyle, inputHint, inputWithError, inputWrapper, label as labelStyle, layout } from '../input.css';
import { toggleButton, inputWithRightIcon, toggleButtonIcon } from './password-input.css';
import nbsp from '../../../ui-common/component/nbsp';
import stopEvent from '../../../../utils/stop-event';
const { useState, useCallback, useMemo } = React;
const PasswordInput = ({ id: propId, className = '', label = nbsp(), fieldClassName = '', error, i18n, hint, scrollOnFocus = false, onFocus, ...inputProps }) => {
    const [type, setType] = useState('password');
    const id = useMemo(() => String(propId || generateElementId()), [propId]);
    const errorMessage = error && error.text && localize(i18n, error.text);
    const toggleInputType = useCallback(() => {
        setType((type) => (type === 'password' ? 'text' : 'password'));
    }, []);
    const handleFocus = useCallback((event) => {
        const { currentTarget } = event;
        currentTarget.scrollIntoView(true);
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(event);
    }, [onFocus]);
    return (React.createElement("div", { className: `${layout} ${className}` },
        React.createElement("label", { htmlFor: id, className: labelStyle }, label),
        React.createElement("div", { className: inputWrapper },
            React.createElement("input", { ...inputProps, type: type, onFocus: scrollOnFocus ? handleFocus : onFocus, className: `
                        ${inputStyle}
                        ${inputWithRightIcon}
                        ${fieldClassName}
                        ${error ? inputWithError : ''}
                    `, id: id }),
            React.createElement("button", { className: toggleButton, type: "button", name: "inputTypeToggle", "aria-label": "Toggle input type", onMouseDown: stopEvent, onClick: toggleInputType },
                React.createElement(Icon, { type: type === 'password' ? 'eye-slash_solid' : 'eye_solid', className: toggleButtonIcon }))),
        hint && !errorMessage && (React.createElement("div", { "data-name": "inputHint", className: inputHint }, hint)),
        errorMessage && (React.createElement("div", { "data-name": "inputError", className: errorHint }, errorMessage))));
};
export default React.memo(PasswordInput);
//# sourceMappingURL=index.js.map