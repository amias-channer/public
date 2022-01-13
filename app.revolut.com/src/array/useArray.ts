"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useArray = void 0;
const react_1 = require("react");
function useArray(initial) {
    const [value, setValue] = react_1.useState(initial);
    const push = react_1.useCallback((a) => {
        setValue((v) => [...v, ...(Array.isArray(a) ? a : [a])]);
    }, []);
    const unshift = react_1.useCallback((a) => setValue((v) => [...(Array.isArray(a) ? a : [a]), ...v]), []);
    const pop = react_1.useCallback(() => setValue((v) => v.slice(0, -1)), []);
    const shift = react_1.useCallback(() => setValue((v) => v.slice(1)), []);
    const move = react_1.useCallback((from, to) => setValue((it) => {
        const copy = it.slice();
        copy.splice(to < 0 ? copy.length + to : to, 0, copy.splice(from, 1)[0]);
        return copy;
    }), []);
    const clear = react_1.useCallback(() => setValue(() => []), []);
    const removeById = react_1.useCallback(
    // @ts-ignore not every array that you will pass down will have object with id field.
    (id) => setValue((arr) => arr.filter((v) => v && v.id !== id)), []);
    const removeIndex = react_1.useCallback((index) => setValue((v) => {
        const copy = v.slice();
        copy.splice(index, 1);
        return copy;
    }), []);
    const modifyById = react_1.useCallback((id, newValue) => 
    // @ts-ignore not every array that you will pass down will have object with id field.
    setValue((arr) => arr.map((v) => (v.id === id ? Object.assign(Object.assign({}, v), newValue) : v))), []);
    const actions = react_1.useMemo(() => ({
        setValue,
        add: push,
        unshift,
        push,
        move,
        clear,
        removeById,
        removeIndex,
        pop,
        shift,
        modifyById,
    }), [modifyById, push, unshift, move, clear, removeById, removeIndex, pop, shift]);
    return [value, actions];
}
exports.useArray = useArray;
exports.default = useArray;
//# sourceMappingURL=useArray.js.map