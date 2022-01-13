import * as React from 'react';
import { selectOptionName } from './base-custom-select';
import { optionItem, selectedOptionItem } from './select.css';
const SelectOptionItem = ({ isSelected, className = '', index, children }, ref) => (React.createElement("button", { ref: ref, type: "button", role: "option", className: `${optionItem} ${isSelected ? selectedOptionItem : ''} ${className}`, "data-name": selectOptionName, "data-index": index }, children));
export default React.memo(React.forwardRef(SelectOptionItem));
//# sourceMappingURL=select-option-item.js.map