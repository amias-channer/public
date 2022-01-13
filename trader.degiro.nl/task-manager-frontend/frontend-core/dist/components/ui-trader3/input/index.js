import * as React from 'react';
import stopEvent from '../../../utils/stop-event';
import generateElementId from '../../ui-common/component/generate-element-id';
import Icon from '../../ui-common/icon/index';
import * as inputStyles from './input.css';
function toggleInputType(event, originalType, newType) {
    var _a;
    const toggleIcon = event.currentTarget;
    const input = (_a = toggleIcon.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('input');
    if (input) {
        // prevent reset focus on the input
        stopEvent(event);
        if (input.type === originalType) {
            toggleIcon.classList.remove(inputStyles.inputIconInactive);
            toggleIcon.classList.add(inputStyles.inputIconActive);
            input.type = newType;
        }
        else {
            toggleIcon.classList.remove(inputStyles.inputIconActive);
            toggleIcon.classList.add(inputStyles.inputIconInactive);
            input.type = originalType;
        }
        const len = input.value.length;
        if (len) {
            input.focus();
            input.setSelectionRange(len, len);
        }
    }
}
function renderInputRightIcon(toggleType, inputType, iconType = 'eye') {
    const onClick = (event) => toggleInputType(event, inputType, toggleType);
    return (React.createElement(Icon, { type: iconType, className: [
            inputStyles.inputIcon,
            inputStyles.inputIconRight,
            inputStyles.inputIconToggle,
            inputType !== toggleType ? inputStyles.inputIconInactive : ''
        ].join(' '), onClick: onClick.bind(null) }));
}
export default class Input extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.randomId = generateElementId();
        this.onFocus = (event) => {
            var _a, _b;
            event.currentTarget.scrollIntoView(true);
            (_b = (_a = this.props).onFocus) === null || _b === void 0 ? void 0 : _b.call(_a, event);
        };
    }
    render() {
        const inputFieldClasses = [inputStyles.inputField];
        const { id = this.randomId, disabled, label, textAlign, error, className = '', inputFieldClassName, inputFieldPrefix, toggleType, type = 'text', toggleTypeIcon, scrollOnFocus, ...elementProps } = this.props;
        const errorMessage = error && (error.text || error.message || '');
        if (textAlign === 'center') {
            inputFieldClasses.push(inputStyles.inputFieldCenter);
        }
        else if (textAlign === 'right') {
            inputFieldClasses.push(inputStyles.inputFieldRight);
        }
        if (toggleType) {
            inputFieldClasses.push(inputStyles.inputFieldIconedRight);
        }
        if (inputFieldClassName) {
            inputFieldClasses.push(inputFieldClassName);
        }
        return (React.createElement("div", { className: `${inputStyles.inputControl} ${className}` },
            React.createElement("div", { className: inputStyles.inputControlContent },
                inputFieldPrefix,
                React.createElement("input", { ...elementProps, id: id, disabled: disabled, className: inputFieldClasses.join(' '), onFocus: scrollOnFocus ? this.onFocus : elementProps.onFocus }),
                toggleType ? renderInputRightIcon(toggleType, type, toggleTypeIcon) : null),
            label ? (React.createElement("label", { htmlFor: id, className: `${inputStyles.inputLabel} ${disabled ? inputStyles.disabledInputLabel : ''}` }, label)) : null,
            errorMessage ? (React.createElement("div", { className: `${inputStyles.inputHint} ${inputStyles.inputHintError}` }, errorMessage)) : null));
    }
}
//# sourceMappingURL=index.js.map