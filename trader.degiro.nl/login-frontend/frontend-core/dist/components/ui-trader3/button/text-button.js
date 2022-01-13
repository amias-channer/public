import * as React from 'react';
import { textButton } from './button.css';
import Button from './index';
const TextButton = ({ className = '', children, ...buttonProps }) => (React.createElement(Button, { ...buttonProps, className: `${textButton} ${className}` }, children));
export default React.memo(TextButton);
//# sourceMappingURL=text-button.js.map