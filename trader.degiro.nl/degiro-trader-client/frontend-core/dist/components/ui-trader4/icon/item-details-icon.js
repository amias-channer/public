import * as React from 'react';
import { activeItemDetailsIconWrapper, itemDetailsIconWrapper } from './icon.css';
import Icon from './index';
const ItemDetailsIcon = ({ isActive, className = '' }) => (React.createElement("span", { tabIndex: 0, className: `${itemDetailsIconWrapper} ${isActive ? activeItemDetailsIconWrapper : ''} ${className}` },
    React.createElement(Icon, { type: "list" })));
export default React.memo(ItemDetailsIcon);
//# sourceMappingURL=item-details-icon.js.map