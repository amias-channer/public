"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBoolean = void 0;
const react_1 = require("react");
function useBoolean(initial) {
    const [value, setValue] = react_1.useState(initial);
    const toggle = react_1.useCallback(() => setValue((v) => !v), []);
    const setTrue = react_1.useCallback(() => setValue(true), []);
    const setFalse = react_1.useCallback(() => setValue(false), []);
    const actions = react_1.useMemo(() => ({ setValue, toggle, setTrue, setFalse }), [setFalse, setTrue, toggle]);
    return react_1.useMemo(() => [value, actions], [actions, value]);
}
exports.useBoolean = useBoolean;
exports.default = useBoolean;
//# sourceMappingURL=useBoolean.js.map