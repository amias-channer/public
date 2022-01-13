import * as React from 'react';
import generateElementId from '../../ui-common/component/generate-element-id';
import * as indexStyles from '../index.css';
import * as radioButtonStyles from './radio.css';
const Radio = ({ id = generateElementId(), disabled, label, children, className = '', iconClassName = '', error, inlineLeft, inlineRight, ...inputProps }) => {
    const errorMessage = error && (error.text || error.message || '');
    return (React.createElement("label", { htmlFor: id, className: [
            radioButtonStyles.radio,
            disabled ? radioButtonStyles.radioDisabled : '',
            inlineRight ? indexStyles.inlineRight : '',
            inlineLeft ? indexStyles.inlineLeft : '',
            className
        ].join(' ') },
        React.createElement("input", { ...inputProps, id: id, disabled: disabled, type: "radio", tabIndex: -1, className: `${radioButtonStyles.radioInput} ${disabled ? '' : radioButtonStyles.radioInputEnabled}` }),
        React.createElement("span", { className: `${radioButtonStyles.radioIcon} ${iconClassName}` }),
        label ? React.createElement("span", { className: radioButtonStyles.radioLabel }, label) : null,
        children,
        errorMessage ? (React.createElement("div", { className: `${radioButtonStyles.radioHint} ${radioButtonStyles.radioHintError}` }, errorMessage)) : null));
};
export default React.memo(Radio);
//# sourceMappingURL=index.js.map