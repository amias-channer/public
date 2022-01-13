"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNumber = void 0;
const react_1 = require("react");
function useNumber(initial, { upperLimit, lowerLimit, loop, step = 1, } = {}) {
    const [value, setValue] = react_1.useState(initial);
    const decrease = react_1.useCallback((d) => {
        setValue((aValue) => {
            const decreaseBy = d !== undefined ? d : step;
            const nextValue = aValue - decreaseBy;
            if (lowerLimit !== undefined) {
                if (nextValue < lowerLimit) {
                    if (loop && upperLimit) {
                        return upperLimit;
                    }
                    return lowerLimit;
                }
            }
            return nextValue;
        });
    }, [loop, lowerLimit, step, upperLimit]);
    const increase = react_1.useCallback((i) => {
        setValue((aValue) => {
            const increaseBy = i !== undefined ? i : step;
            const nextValue = aValue + increaseBy;
            if (upperLimit !== undefined) {
                if (nextValue > upperLimit) {
                    if (loop && lowerLimit) {
                        return lowerLimit;
                    }
                    return upperLimit;
                }
            }
            return nextValue;
        });
    }, [loop, step, upperLimit, lowerLimit]);
    const actions = react_1.useMemo(() => ({
        setValue,
        increase,
        decrease,
    }), [decrease, increase]);
    return [value, actions];
}
exports.useNumber = useNumber;
exports.default = useNumber;
//# sourceMappingURL=useNumber.js.map