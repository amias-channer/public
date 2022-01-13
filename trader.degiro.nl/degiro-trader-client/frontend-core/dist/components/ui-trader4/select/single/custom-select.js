import * as React from 'react';
import BaseCustomSelect from '../base-custom-select';
import getSelectOptionValue from '../get-select-option-value';
import { hoveredOptionItem } from '../select.css';
export default class CustomSingleSelect extends BaseCustomSelect {
    selectOption(selectedOption) {
        this.close();
        this.setState({ searchText: '' });
        this.props.onChange(selectedOption.value);
    }
    getSelectedValues() {
        const { selectedOption } = this.props;
        const selectedOptionValue = selectedOption && getSelectOptionValue(selectedOption);
        return selectedOptionValue === undefined ? [] : [selectedOptionValue];
    }
    renderSelectLabelContent() {
        const { selectedOption, placeholder } = this.props;
        return selectedOption ? selectedOption.label : placeholder;
    }
    renderHiddenValueInput() {
        const { selectedOption, name } = this.props;
        const selectedOptionValue = selectedOption && getSelectOptionValue(selectedOption);
        return React.createElement("input", { type: "hidden", name: name, value: selectedOptionValue });
    }
    componentDidUpdate(prevProps, prevState) {
        const { selectedOption } = this.props;
        const { isOpened } = this.state;
        const { selectedOption: prevSelectedOption } = prevProps;
        const prevValue = prevSelectedOption && getSelectOptionValue(prevSelectedOption);
        const currentValue = selectedOption && getSelectOptionValue(selectedOption);
        if (isOpened && isOpened !== prevState.isOpened) {
            const selectedOptionElement = this.selectedOptionElementRef.current;
            selectedOptionElement === null || selectedOptionElement === void 0 ? void 0 : selectedOptionElement.classList.add(hoveredOptionItem);
            selectedOptionElement === null || selectedOptionElement === void 0 ? void 0 : selectedOptionElement.scrollIntoView({ block: 'center' });
        }
        if (prevProps.options !== this.props.options || prevValue !== currentValue) {
            return this.setState({ searchText: '' });
        }
    }
}
//# sourceMappingURL=custom-select.js.map