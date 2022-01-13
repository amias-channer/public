import { useEffect, useState } from 'react';
export default function useIntersectionObserver(options = {}) {
    const [targetEl, setTargetElement] = useState(null);
    const [rootEl, setRootElement] = useState(null);
    const [entry, setEntry] = useState(undefined);
    useEffect(() => {
        const updateEntry = ([entry]) => setEntry(entry);
        if (!window.IntersectionObserver || !targetEl) {
            return;
        }
        const intersectionObserver = new IntersectionObserver(updateEntry, {
            threshold: 1,
            root: rootEl,
            ...options
        });
        intersectionObserver.observe(targetEl);
        return () => intersectionObserver.disconnect();
    }, [targetEl, rootEl, ...Object.values(options)]);
    return {
        entry,
        setTargetElement,
        setRootElement
    };
}
//# sourceMappingURL=use-intersection-observer.js.map