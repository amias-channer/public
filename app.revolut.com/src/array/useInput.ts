"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInput = void 0;
const react_1 = require("react");
function useInput(initial = '') {
    const stringified = initial.toString();
    const [value, setValue] = react_1.useState(stringified);
    const onChange = react_1.useCallback((e) => setValue(e.target.value.toString()), []);
    const clear = react_1.useCallback(() => setValue(''), []);
    const hasValue = value !== undefined && value !== null && value.trim() !== '';
    const actions = react_1.useMemo(() => ({
        setValue,
        clear,
        onChange,
    }), [clear, onChange]);
    const values = react_1.useMemo(() => [value, hasValue], [hasValue, value]);
    return [values, actions];
}
exports.useInput = useInput;
exports.default = useInput;
//# sourceMappingURL=useInput.js.map