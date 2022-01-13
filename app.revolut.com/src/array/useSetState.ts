"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSetState = void 0;
const react_1 = require("react");
function useSetState(initialValue) {
    const [value, setValue] = react_1.useState(initialValue);
    const setState = react_1.useCallback((v) => {
        return setValue((oldValue) => (Object.assign(Object.assign({}, oldValue), (typeof v === 'function' ? v(oldValue) : v))));
    }, [setValue]);
    // Disabled on purpose to avoid new references on each render.
    // Since initialValue will be object and new reference is
    // guaranteed here, while values are the same, hence we can keep using old function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resetState = react_1.useCallback(() => setValue(initialValue), []);
    return [value, setState, resetState];
}
exports.useSetState = useSetState;
exports.default = useSetState;
//# sourceMappingURL=useSetState.js.map