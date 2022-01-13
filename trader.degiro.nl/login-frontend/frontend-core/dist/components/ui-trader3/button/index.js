import * as React from 'react';
import { button as buttonStyle, buttonWithLeftIcon, buttonWithRightIcon, inactiveButton, leftButtonIcon, rightButtonIcon } from './button.css';
const Button = ({ leftIcon, rightIcon, children, className = '', disabled, ...buttonProps }) => {
    const iconNode = leftIcon || rightIcon;
    return (React.createElement("button", { type: "button", ...buttonProps, disabled: disabled, className: [
            buttonStyle,
            leftIcon ? buttonWithLeftIcon : rightIcon ? buttonWithRightIcon : '',
            disabled ? inactiveButton : '',
            className
        ].join(' ') },
        iconNode ? React.createElement("div", { className: rightIcon ? rightButtonIcon : leftButtonIcon }, iconNode) : null,
        children));
};
export default React.memo(Button);
//# sourceMappingURL=index.js.map