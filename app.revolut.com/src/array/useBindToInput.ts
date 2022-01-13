"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBindToInput = void 0;
const react_1 = require("react");
function useBindToInput(useInputResult) {
    const [values, actions] = useInputResult;
    return [
        values,
        actions,
        react_1.useMemo(() => ({
            eventBind: {
                onChange: actions.onChange,
                value: values[0],
            },
            valueBind: {
                onChange: actions.setValue,
                value: values[0],
            },
        }), [actions, values]),
    ];
}
exports.useBindToInput = useBindToInput;
exports.default = useBindToInput;
//# sourceMappingURL=useBindToInput.js.map