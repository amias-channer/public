import * as React from 'react';
const { useRef, useLayoutEffect } = React;
const PersistentHorizontalScrollSection = ({ activeItemSelector, children, ...elementProps }) => {
    const scrollLayoutRef = useRef(null);
    const { current: scrollLayout } = scrollLayoutRef;
    const activeItem = scrollLayout === null || scrollLayout === void 0 ? void 0 : scrollLayout.querySelector(activeItemSelector);
    useLayoutEffect(() => {
        if (!scrollLayout || !activeItem) {
            return;
        }
        const scrollFrameId = requestAnimationFrame(() => {
            const { offsetLeft, clientWidth } = activeItem;
            if (offsetLeft + clientWidth > scrollLayout.scrollLeft + scrollLayout.clientWidth ||
                offsetLeft < scrollLayout.scrollLeft) {
                scrollLayout.scrollLeft = offsetLeft;
            }
        });
        return () => cancelAnimationFrame(scrollFrameId);
    }, [activeItem]);
    return (React.createElement("div", { ...elementProps, ref: scrollLayoutRef }, children));
};
export default React.memo(PersistentHorizontalScrollSection);
//# sourceMappingURL=persistent-horizontal-scroll-section.js.map