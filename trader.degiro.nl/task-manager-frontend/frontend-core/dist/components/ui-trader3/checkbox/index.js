import * as React from 'react';
import generateElementId from '../../ui-common/component/generate-element-id';
import * as indexStyles from '../index.css';
import * as checkboxStyles from './checkbox.css';
const Checkbox = ({ id = generateElementId(), disabled, label, children, className = '', iconClassName = '', error, inlineLeft, inlineRight, ...inputProps }) => {
    const errorMessage = error && (error.text || error.message || '');
    return (React.createElement("label", { htmlFor: id, className: [
            checkboxStyles.checkbox,
            disabled ? checkboxStyles.checkboxDisabled : '',
            inlineRight ? indexStyles.inlineRight : '',
            inlineLeft ? indexStyles.inlineLeft : '',
            className
        ].join(' ') },
        React.createElement("input", { ...inputProps, id: id, disabled: disabled, type: "checkbox", tabIndex: -1, className: `${checkboxStyles.checkboxInput} ${disabled ? '' : checkboxStyles.checkboxInputEnabled}` }),
        React.createElement("span", { className: `${checkboxStyles.checkboxIcon} ${iconClassName}` }),
        label ? React.createElement("span", { className: checkboxStyles.checkboxLabel }, label) : null,
        children,
        errorMessage ? (React.createElement("div", { className: `${checkboxStyles.checkboxHint} ${checkboxStyles.checkboxHintError}` }, errorMessage)) : null));
};
export default React.memo(Checkbox);
//# sourceMappingURL=index.js.map