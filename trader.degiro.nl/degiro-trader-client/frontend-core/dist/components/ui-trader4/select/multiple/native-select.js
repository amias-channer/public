import * as React from 'react';
import isIOS from '../../../../platform/is-ios';
import { hiddenSelectControl } from '../../control-utils.css';
import Icon from '../../icon';
import getSelectOptionValue from '../get-select-option-value';
import { dropdownIndicator, label as labelClassName } from '../select.css';
const { useCallback } = React;
const NativeMultiSelect = ({ selectedOptions, disabled, className, options, placeholder, label, onChange }) => {
    const onBlurOrChange = useCallback((event) => {
        // TODO: check if it is possible to replace the iOS check with something related to the event
        // on iOS/Safari the change is dispatched every time an option is toggled, and the select is blurred once
        // closed on Android/Chrome the change is dispatched only after the select control closes and it stays
        // focused
        if (event.type === 'change' && isIOS()) {
            return;
        }
        const nativeOptions = [].slice.call(event.currentTarget.options, 0);
        const newSelectedValues = [];
        let isChanged = false;
        nativeOptions.forEach((nativeOption) => {
            const { selected } = nativeOption;
            const initialSelected = nativeOption.dataset.initialSelected === 'true';
            if (selected) {
                const index = Number(nativeOption.value);
                const selectedOption = options[index];
                newSelectedValues.push(selectedOption.value);
            }
            isChanged = isChanged || selected !== initialSelected;
        });
        if (isChanged) {
            onChange(newSelectedValues);
        }
    }, [options, onChange]);
    const selectedOptionsCustomValues = [];
    const selectedOptionsNativeValues = [];
    const labels = [];
    selectedOptions.forEach((option) => {
        selectedOptionsCustomValues.push(getSelectOptionValue(option));
        labels.push(option.nativeElementLabel || option.label);
    });
    const labelContent = label || labels.join(', ') || placeholder;
    const filteredOptions = disabled
        ? []
        : options.map((option, index) => {
            const label = option.nativeElementLabel || option.label;
            const value = getSelectOptionValue(option);
            const nodeKey = String(value || label);
            const isSelected = value != null && selectedOptionsCustomValues.includes(value);
            const optionValue = String(index);
            if (isSelected) {
                selectedOptionsNativeValues.push(optionValue);
            }
            return (React.createElement("option", { selected: isSelected, "data-initial-selected": isSelected, key: nodeKey, value: optionValue }, label));
        });
    return (React.createElement("label", { "aria-expanded": "false", "aria-haspopup": "listbox", className: className },
        labelContent && React.createElement("span", { className: labelClassName }, labelContent),
        React.createElement(Icon, { type: "keyboard_arrow_down", className: dropdownIndicator }),
        filteredOptions[0] && (React.createElement("select", { className: hiddenSelectControl, multiple: true, value: selectedOptionsNativeValues, onBlur: onBlurOrChange, onChange: onBlurOrChange }, filteredOptions))));
};
export default React.memo(NativeMultiSelect);
//# sourceMappingURL=native-select.js.map