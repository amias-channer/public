import * as React from 'react';
import isTouchDevice from '../../../platform/is-touch-device';
import addEventListenersOutside from '../../../utils/events/add-event-listeners-outside';
import Icon from '../icon';
import Popover from '../popover';
import getSelectOptionValue from './get-select-option-value';
import InputSearch from './input-search';
import isSearchable from './is-searchable';
import { dropdownIndicator, hoveredOptionItem as optionActiveClassName, label as labelClassName, optionItem, optionItemContent, optionsList as optionsListBasicClassName } from './select.css';
import SelectOptionItem from './select-option-item';
export const selectOptionName = 'selectOption';
const optionHoveredQuerySelector = `.${optionItem}:hover`;
const optionActiveQuerySelector = `.${optionActiveClassName}`;
const optionQuerySelector = `.${optionItem}`;
function highlightFirstOption(optionsList) {
    const { firstElementChild: firstOption } = optionsList;
    if (firstOption) {
        firstOption.classList.add(optionActiveClassName);
        firstOption.scrollIntoView();
    }
}
function highlightNextOption(optionsList, highlightedOption) {
    const hoveredOptionSibling = highlightedOption.nextElementSibling || optionsList.firstElementChild;
    if (hoveredOptionSibling) {
        highlightedOption.classList.remove(optionActiveClassName);
        hoveredOptionSibling.classList.add(optionActiveClassName);
        hoveredOptionSibling.scrollIntoView({ block: 'center' });
    }
}
function highlightPrevOption(optionsList, highlightedOption) {
    const hoveredOptionSibling = highlightedOption.previousElementSibling || optionsList.lastElementChild;
    if (hoveredOptionSibling) {
        highlightedOption.classList.remove(optionActiveClassName);
        hoveredOptionSibling.classList.add(optionActiveClassName);
        hoveredOptionSibling.scrollIntoView({ block: 'center' });
    }
}
export default class BaseCustomSelect extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.refElements = [null, null];
        this.unsubscribeList = [];
        this.isMultiselectable = false;
        this.selectedOptionElementRef = React.createRef();
        this.state = {
            searchText: '',
            isOpened: false
        };
        this.closeHandler = () => {
            if (this.state.isOpened) {
                this.close();
            }
        };
        this.onRootElRef = (el) => (this.refElements[0] = el);
        this.onListElementRef = (el) => (this.refElements[1] = el);
        this.onRootClick = (event) => {
            // [TRADER-387] do not handle events on children
            if (event.currentTarget !== event.target) {
                return;
            }
            if (this.state.isOpened) {
                this.close();
            }
            else {
                this.open();
            }
        };
        this.preventKeysDefaults = (event) => {
            const { key } = event;
            if (this.state.isOpened && key === 'Escape') {
                event.stopPropagation();
            }
            if (key === 'ArrowUp' || // Prevent cursor move inside input element
                key === 'ArrowDown' ||
                key === 'Enter' // Prevent form submit
            ) {
                event.preventDefault();
            }
        };
        this.onControlFieldKeyUp = (event) => {
            const { key } = event;
            const { isOpened } = this.state;
            const { options } = this.props;
            const [, optionsList] = this.refElements;
            if ((key === 'ArrowUp' || key === 'ArrowDown' || key === 'Enter') && !isOpened) {
                event.preventDefault();
                return this.open();
            }
            switch (key) {
                case 'Escape': {
                    this.closeHandler();
                    return;
                }
                case 'ArrowDown': {
                    if (!optionsList) {
                        return;
                    }
                    const highlightedOption = optionsList.querySelector(optionActiveQuerySelector) ||
                        optionsList.querySelector(optionHoveredQuerySelector);
                    return highlightedOption
                        ? highlightNextOption(optionsList, highlightedOption)
                        : highlightFirstOption(optionsList);
                }
                case 'ArrowUp': {
                    if (!optionsList) {
                        return;
                    }
                    const highlightedOption = optionsList.querySelector(optionActiveQuerySelector) ||
                        optionsList.querySelector(optionHoveredQuerySelector);
                    return highlightedOption
                        ? highlightPrevOption(optionsList, highlightedOption)
                        : highlightFirstOption(optionsList);
                }
                case 'Enter': {
                    if (!optionsList) {
                        return;
                    }
                    const highlightedOption = optionsList.querySelector(optionActiveQuerySelector) ||
                        // select a first item from the list if user didn't select any
                        optionsList.querySelector(optionQuerySelector);
                    const highlightedOptionElDataset = highlightedOption === null || highlightedOption === void 0 ? void 0 : highlightedOption.dataset;
                    const selectedOption = options[Number(highlightedOptionElDataset === null || highlightedOptionElDataset === void 0 ? void 0 : highlightedOptionElDataset.index)];
                    return selectedOption ? this.selectOption(selectedOption) : this.close();
                }
                default: {
                    const searchText = String(event.currentTarget.value);
                    // [maxlength=0] can be ignored by the browser
                    if (isSearchable(options, this.props.searchable) && searchText !== this.state.searchText) {
                        return this.setState({ isOpened: true, searchText });
                    }
                }
            }
        };
        this.onOptionsContainerClick = (event) => {
            const { dataset = {} } = event.target;
            // cancel event handling by current element and other popup elements (e.g. Tooltip)
            event.stopPropagation();
            if (dataset.name === selectOptionName) {
                const selectedOptionIndex = Number(dataset.index);
                const selectedOption = this.props.options[selectedOptionIndex];
                this.selectOption(selectedOption);
            }
        };
        this.open = () => this.setState({ isOpened: true });
        this.close = () => this.setState({ searchText: '', isOpened: false });
    }
    selectOption(_selectedOption) {
        //
    }
    getSelectedValues() {
        return [];
    }
    renderSelectLabelContent() {
        return null;
    }
    renderOptionContent(option, _isSelected) {
        return (React.createElement("div", { className: optionItemContent },
            option.preLabel,
            option.label,
            option.postLabel));
    }
    renderHiddenValueInput() {
        return null;
    }
    renderSelectOptions(viewOptions, selectedValues) {
        return viewOptions.map(([option, index]) => {
            const { label, className } = option;
            const value = getSelectOptionValue(option);
            const isSelected = selectedValues.includes(value);
            return (React.createElement(SelectOptionItem, { ref: isSelected ? this.selectedOptionElementRef : null, isSelected: isSelected, className: className, key: String(value || label), index: index }, this.renderOptionContent(option, isSelected)));
        });
    }
    componentDidMount() {
        this.unsubscribeList.push(
        // "capture" option should be "false" to no close a tooltip by click in child "portal" elements, e.g. in
        // Select. When you click on list of Select element, it stops event propagation and it won't be caught by
        // `onGlobalPointerEvent` handler
        addEventListenersOutside(this.refElements, isTouchDevice() ? 'touchend' : 'click', this.closeHandler, {
            capture: false
        }), addEventListenersOutside(this.refElements, 'scroll', this.closeHandler, {
            passive: true,
            capture: true
        }), addEventListenersOutside(this.refElements, 'focusin', this.closeHandler));
    }
    componentWillUnmount() {
        this.unsubscribeList.map((unsubscribe) => unsubscribe());
        this.unsubscribeList.length = 0;
    }
    render() {
        const [rootEl] = this.refElements;
        const { options, disabled, className = '', optionsListClassName } = this.props;
        const { isOpened, searchText } = this.state;
        const isSearchableOptionsList = isSearchable(options, this.props.searchable);
        const selectedValues = this.getSelectedValues();
        /**
         * NOTE: It is not "real" normalization, and I am not sure if we need it.
         * But will be good to check how our code works with UTF
         * TODO: check if there is any reason to use String.prototype.normalize()
         */
        const normalizedSearchText = searchText.toLowerCase();
        const hasOpenedPopup = Boolean(rootEl && isOpened && !disabled);
        const viewOptions = !hasOpenedPopup
            ? []
            : options
                .map((option, index) => [option, index])
                .filter(([option]) => !normalizedSearchText || option.label.toLowerCase().includes(normalizedSearchText));
        return (React.createElement("label", { ref: this.onRootElRef, onClick: disabled ? undefined : this.onRootClick, "aria-expanded": isOpened ? 'true' : 'false', "aria-haspopup": "listbox", className: className },
            React.createElement("span", { className: labelClassName }, this.renderSelectLabelContent()),
            this.renderHiddenValueInput(),
            !disabled && (React.createElement(InputSearch, { value: searchText, onKeyUp: this.onControlFieldKeyUp, onKeyDown: this.preventKeysDefaults, maxLength: isSearchableOptionsList ? 1000 : 0, "aria-hidden": selectedValues.length ? undefined : 'true', autoFocus: isOpened, role: isSearchableOptionsList && isOpened ? 'searchbox' : undefined })),
            React.createElement(Icon, { type: isOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down', className: dropdownIndicator }),
            hasOpenedPopup && viewOptions.length !== 0 && rootEl && (React.createElement(Popover, { relatedElement: rootEl, width: "target-width", verticalPosition: "after", horizontalPosition: "inside-start" },
                React.createElement("div", { ref: this.onListElementRef, onClick: this.onOptionsContainerClick, className: `${optionsListBasicClassName} ${optionsListClassName}`, role: "listbox", "aria-multiselectable": this.isMultiselectable }, this.renderSelectOptions(viewOptions, selectedValues))))));
    }
}
//# sourceMappingURL=base-custom-select.js.map