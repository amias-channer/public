import * as React from 'react';
import partition from '../../../../utils/collection/partition';
import Icon from '../../icon';
import BaseCustomSelect from '../base-custom-select';
import getSelectOptionValue from '../get-select-option-value';
import SelectOptionItem from '../select-option-item';
import { optionItemContent } from '../select.css';
import { activeCheckbox, checkbox, checkboxIcon, footerContainer, initiallySelectedOption, multiSelectOptionItem } from './multi-select.css';
function hasChangedValues(selectedValues, initialSelectedValues) {
    return (selectedValues.length !== initialSelectedValues.length ||
        selectedValues.some((value) => !initialSelectedValues.includes(value)));
}
export default class CustomMultiSelect extends BaseCustomSelect {
    constructor(props) {
        super(props);
        this.isMultiselectable = true;
        this.deselectAll = () => {
            this.setState({ selectedValues: [] });
        };
        this.selectAll = () => {
            const selectedAllValues = this.props.options.map(getSelectOptionValue);
            this.setState({ selectedValues: selectedAllValues });
        };
        this.apply = () => {
            this.props.onChange(this.state.selectedValues);
            this.close();
        };
        Object.assign(this.state, this.getSelectedValuesState());
    }
    renderSelectOptionItem([option, index], additionalClassName = '') {
        const { label, className = '' } = option;
        const value = getSelectOptionValue(option);
        const isSelected = this.state.selectedValues.includes(getSelectOptionValue(option));
        return (React.createElement(SelectOptionItem, { key: String(value || label), isSelected: isSelected, className: `${multiSelectOptionItem} ${className} ${additionalClassName}`, index: index }, this.renderOptionContent(option, isSelected)));
    }
    getSelectedValuesState() {
        const selectedValues = this.props.selectedOptions.map(getSelectOptionValue);
        return {
            initialSelectedValues: selectedValues,
            selectedValues
        };
    }
    triggerChangeAfterClosing() {
        const { initialSelectedValues, selectedValues } = this.state;
        if (hasChangedValues(selectedValues, initialSelectedValues)) {
            this.props.onChange(selectedValues);
        }
    }
    resetSelectedValuesAfterClose() {
        const { initialSelectedValues, selectedValues } = this.state;
        if (hasChangedValues(selectedValues, initialSelectedValues)) {
            this.setState({ selectedValues: [...initialSelectedValues] });
        }
    }
    selectOption(selectedOption) {
        const selectedOptionValue = getSelectOptionValue(selectedOption);
        this.setState(({ selectedValues }) => {
            const valueIndex = selectedValues.indexOf(selectedOptionValue);
            // select option
            if (valueIndex === -1) {
                return {
                    selectedValues: [...selectedValues, selectedOptionValue]
                };
            }
            // unselect option
            return {
                selectedValues: [...selectedValues.slice(0, valueIndex), ...selectedValues.slice(valueIndex + 1)]
            };
        });
    }
    getSelectedValues() {
        return this.state.selectedValues;
    }
    renderSelectLabelContent() {
        const { label, selectedOptions, placeholder } = this.props;
        return label || selectedOptions.map((option) => option.label).join(', ') || placeholder;
    }
    renderOptionContent(option, isSelected) {
        return (React.createElement("div", { className: optionItemContent },
            React.createElement("span", { className: `${checkbox} ${isSelected ? activeCheckbox : ''}` }, isSelected && React.createElement(Icon, { type: "check", className: checkboxIcon })),
            option.preLabel,
            option.label,
            option.postLabel));
    }
    renderSelectOptions(viewOptions, selectedValues) {
        const { initialSelectedValues } = this.state;
        const { footer } = this.props;
        const [initialSelectedOptions, remainingOptions] = partition(viewOptions, ([option]) => initialSelectedValues.includes(getSelectOptionValue(option)));
        const initialSelectedOptionsItems = initialSelectedOptions.map((item) => this.renderSelectOptionItem(item, initiallySelectedOption));
        const remainingSelectOptionsItems = remainingOptions.map((item) => this.renderSelectOptionItem(item));
        return (React.createElement(React.Fragment, null,
            initialSelectedOptionsItems,
            remainingSelectOptionsItems,
            footer && (React.createElement("div", { className: footerContainer }, footer({
                deselectAll: this.deselectAll,
                selectAll: this.selectAll,
                apply: this.apply,
                hasSelectedValues: selectedValues.length > 0
            })))));
    }
    componentDidUpdate(prevProps, prevState) {
        const { isOpened } = this.state;
        if (prevProps.options !== this.props.options || prevProps.selectedOptions !== this.props.selectedOptions) {
            return this.setState({
                ...this.getSelectedValuesState(),
                searchText: ''
            });
        }
        if (!isOpened && isOpened !== prevState.isOpened) {
            return this.props.footer ? this.resetSelectedValuesAfterClose() : this.triggerChangeAfterClosing();
        }
    }
}
//# sourceMappingURL=custom-select.js.map