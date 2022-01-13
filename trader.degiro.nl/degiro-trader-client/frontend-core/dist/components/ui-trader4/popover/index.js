import * as React from 'react';
import subscribeOnAnimationFrame from '../../../utils/subscribe-on-animation-frame';
import Portal from '../../ui-common/portal';
import getCssTextOfPopupRelativeToTarget from './get-css-text-of-popup-relative-to-target';
import { globalFloatBlock as popup } from './popover.css';
const { useRef, useLayoutEffect } = React;
const Popover = ({ children, relatedElement, verticalPosition = 'after', horizontalPosition = 'after', gutter = 4, // 4px is a css base grid value
width = 'auto', height }) => {
    const popupElRef = useRef(null);
    useLayoutEffect(() => {
        const { current: popupEl } = popupElRef;
        if (popupEl) {
            return subscribeOnAnimationFrame(() => {
                popupEl.style.cssText = getCssTextOfPopupRelativeToTarget(relatedElement.getBoundingClientRect(), popupEl.getBoundingClientRect(), document.body.getBoundingClientRect(), {
                    verticalPosition,
                    horizontalPosition,
                    gutter,
                    width,
                    height
                });
            });
        }
    }, [verticalPosition, horizontalPosition, gutter, width, height]);
    return (React.createElement(Portal, null,
        React.createElement("div", { className: popup, ref: popupElRef }, children)));
};
export default Popover;
//# sourceMappingURL=index.js.map