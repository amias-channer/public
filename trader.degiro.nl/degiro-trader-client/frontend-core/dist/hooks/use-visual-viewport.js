import { useLayoutEffect, useState } from 'react';
const getViewportInfo = () => {
    const { visualViewport } = window;
    const { documentElement } = document;
    return {
        width: visualViewport ? visualViewport.width : documentElement.clientWidth,
        height: visualViewport ? visualViewport.height : documentElement.clientHeight
    };
};
export default function useVisualViewport() {
    const [viewport, setViewport] = useState(getViewportInfo);
    useLayoutEffect(() => {
        const { visualViewport } = window;
        const onResize = () => setViewport(getViewportInfo());
        if (visualViewport) {
            visualViewport.addEventListener('resize', onResize);
            return () => visualViewport.removeEventListener('resize', onResize);
        }
        const eventOptions = { capture: true, passive: true };
        window.addEventListener('resize', onResize, eventOptions);
        return () => window.removeEventListener('resize', onResize, eventOptions);
    }, []);
    return viewport;
}
//# sourceMappingURL=use-visual-viewport.js.map