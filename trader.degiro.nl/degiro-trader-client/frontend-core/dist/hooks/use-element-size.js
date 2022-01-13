import { useLayoutEffect, useState } from 'react';
import subscribeOnAnimationFrame from '../utils/subscribe-on-animation-frame';
export default function useElementSize(targetElRef) {
    const [elementSize, setElementSize] = useState();
    useLayoutEffect(() => {
        const { current: targetEl } = targetElRef;
        if (!targetEl) {
            return;
        }
        const onMeasure = (width, height) => {
            if (!elementSize || elementSize.width !== width || elementSize.height !== height) {
                setElementSize({ width, height });
            }
        };
        if (typeof ResizeObserverEntry !== 'undefined' &&
            ResizeObserverEntry.prototype &&
            'borderBoxSize' in ResizeObserverEntry.prototype) {
            const observer = new ResizeObserver((entries) => {
                var _a;
                /*
                    `borderBoxSize` includes content + padding + border as `.getBoundingClientRect()`
                    ResizeObserverEntry.borderBoxSize returns:
                        - ResizeObserverSize[] in Chrome;
                        - ResizeObserverSize in Firefox;
                */
                const originalBorderBoxSize = (_a = entries[0]) === null || _a === void 0 ? void 0 : _a.borderBoxSize;
                const borderBoxSize = Array.isArray(originalBorderBoxSize)
                    ? originalBorderBoxSize[0]
                    : originalBorderBoxSize;
                if (!borderBoxSize) {
                    return;
                }
                const { inlineSize: width, blockSize: height } = borderBoxSize;
                onMeasure(width, height);
            });
            observer.observe(targetEl, { box: 'border-box' });
            return () => observer.disconnect();
        }
        return subscribeOnAnimationFrame(() => {
            const { width, height } = targetEl.getBoundingClientRect();
            onMeasure(width, height);
        });
    }, [elementSize, targetElRef, targetElRef.current]);
    return elementSize;
}
//# sourceMappingURL=use-element-size.js.map