import { useEffect } from 'react';
export default function useScrollIntoView(elRef, alignToTop = true, deps = []) {
    /*
        we use useEffect instead of useLayoutEffect because in some cases the parent element of our refEl may not be
        painted on the DOM yet and respectively it would not have measurements (scrollWidth, scrollHeight, etc.)
    */
    useEffect(() => { var _a; return (_a = elRef === null || elRef === void 0 ? void 0 : elRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView(alignToTop); }, [elRef, ...deps]);
}
//# sourceMappingURL=use-scroll-into-view.js.map