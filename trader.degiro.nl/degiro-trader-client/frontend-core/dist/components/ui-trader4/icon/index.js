import * as React from 'react';
import { inlineLeft as inlineLeftClassName, inlineRight as inlineRightClassName } from '../alignment-utils.css';
import { flipped as flippedClassName } from '../position-utils.css';
import { hintIcon as hintIconClassName, icon, iconSpinning, verticalMiddleAlignedIcon, verticalTopAlignedIcon } from './icon.css';
let iconsTemplates = {};
export function loadIcons() {
    return import(/* webpackChunkName: "icons-templates" */ './icons-templates').then((module) => {
        iconsTemplates = module.default;
    });
}
const Icon = ({ hintIcon, infoIcon, type = hintIcon ? 'help' : infoIcon ? 'info' : undefined, flipped, spin, verticalAlign, inlineRight, inlineLeft, className = '', ...domProps }) => {
    const template = type && iconsTemplates[type];
    return (React.createElement("i", { role: "img", "data-name": "icon", "data-type": type, "aria-hidden": "true", ...domProps, 
        // eslint-disable-next-line react/forbid-dom-props
        dangerouslySetInnerHTML: template ? { __html: template } : undefined, className: [
            icon,
            hintIcon ? hintIconClassName : '',
            spin ? iconSpinning : '',
            flipped ? flippedClassName : '',
            inlineRight ? inlineRightClassName : inlineLeft ? inlineLeftClassName : '',
            verticalAlign === 'middle'
                ? verticalMiddleAlignedIcon
                : verticalAlign === 'top'
                    ? verticalTopAlignedIcon
                    : '',
            className
        ].join(' ') }));
};
export default React.memo(Icon);
//# sourceMappingURL=index.js.map