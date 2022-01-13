import * as React from 'react';
import deactivateActiveElement from '../../../../platform/deactivate-active-element';
import { filterOptionAllId } from '../../../../services/filter';
import { hiddenSelectControl } from '../../control-utils.css';
import Icon from '../../icon';
import getSelectOptionValue from '../get-select-option-value';
import HiddenNativeOption from '../hidden-native-option';
import { dropdownIndicator, label as labelClassName } from '../select.css';
const { useCallback } = React;
const NativeSingleSelect = ({ selectedOption, disabled, className, options, name, placeholder, onChange }) => {
    var _a;
    const onChangeEvent = useCallback((event) => {
        const selectedOptionIndex = Number(event.currentTarget.value);
        const selectedOption = options[selectedOptionIndex];
        deactivateActiveElement();
        if (selectedOption) {
            onChange(selectedOption.value);
        }
    }, [options, onChange]);
    const selectedOptionValue = selectedOption && getSelectOptionValue(selectedOption);
    const labelContent = (_a = selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label) !== null && _a !== void 0 ? _a : placeholder;
    const filteredOptions = disabled
        ? []
        : options.map((option, index) => {
            const label = option.nativeElementLabel || option.label;
            const value = getSelectOptionValue(option);
            const nodeKey = String(value || label);
            const isSelected = value !== undefined && value === selectedOptionValue;
            return (React.createElement("option", { selected: isSelected, key: nodeKey, value: index }, label));
        });
    const selectedValue = disabled
        ? filterOptionAllId
        : options.findIndex((option) => {
            const value = getSelectOptionValue(option);
            return value != null && value === selectedOptionValue;
        });
    return (React.createElement("label", { "aria-expanded": "false", "aria-haspopup": "listbox", className: className },
        labelContent && React.createElement("span", { className: labelClassName }, labelContent),
        React.createElement("input", { type: "hidden", name: name, value: selectedOptionValue }),
        React.createElement(Icon, { type: "keyboard_arrow_down", className: dropdownIndicator }),
        filteredOptions[0] && (React.createElement("select", { className: hiddenSelectControl, value: selectedValue, onChange: onChangeEvent },
            selectedValue === filterOptionAllId && labelContent && (React.createElement(HiddenNativeOption, null, labelContent)),
            filteredOptions))));
};
export default React.memo(NativeSingleSelect);
//# sourceMappingURL=native-select.js.map