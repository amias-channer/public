import BigNumber from 'big.js';
function createMathOperation(method) {
    const isTimesOperation = method === BigNumber.prototype.times;
    return function floatMathOperation(firstValue) {
        if (!firstValue && isTimesOperation) {
            return 0;
        }
        let result;
        const { length } = arguments;
        for (let i = 0; i < length; i++) {
            const value = arguments[i] || 0;
            result = result === undefined ? new BigNumber(value) : method.call(result, value);
        }
        // NaN => 0
        return Number(result) || 0;
    };
}
export const multiply = createMathOperation(BigNumber.prototype.times);
export const plus = createMathOperation(BigNumber.prototype.plus);
export const minus = createMathOperation(BigNumber.prototype.minus);
//# sourceMappingURL=decimal.js.map