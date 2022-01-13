import * as React from 'react';
import generateElementId from '../../ui-common/component/generate-element-id';
import * as inputStyles from '../input/input.css';
const { useState } = React;
const Select = ({ id, controlClassName = '', label = ' ', error, values, className = '', disableFirstOption, ...elementProps }) => {
    const errorMessage = error === null || error === void 0 ? void 0 : error.text;
    const [randomId] = useState(generateElementId);
    id = id || randomId;
    return (React.createElement("div", { className: `${inputStyles.inputControl} ${className}` },
        React.createElement("select", { ...elementProps, id: id, className: `${inputStyles.inputField} ${controlClassName}` }, values.map(({ id, disabled, label }, index) => (React.createElement("option", { value: id, key: id, disabled: disabled || (!index && disableFirstOption) }, label)))),
        React.createElement("label", { htmlFor: id, className: inputStyles.inputLabel }, label),
        errorMessage ? (React.createElement("div", { className: `${inputStyles.inputHint} ${inputStyles.inputHintError}` }, errorMessage)) : null));
};
export default React.memo(Select);
//# sourceMappingURL=index.js.map