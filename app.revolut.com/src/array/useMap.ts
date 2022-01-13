"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMap = void 0;
const react_1 = require("react");
function useMap(initialState = new Map()) {
    const [map, setMap] = react_1.useState(Array.isArray(initialState) ? new Map(initialState) : initialState);
    const set = react_1.useCallback((key, value) => {
        setMap((aMap) => {
            const copy = new Map(aMap);
            return copy.set(key, value);
        });
    }, []);
    const deleteByKey = react_1.useCallback((key) => {
        setMap((_map) => {
            const copy = new Map(_map);
            copy.delete(key);
            return copy;
        });
    }, []);
    const clear = react_1.useCallback(() => {
        setMap(() => new Map());
    }, []);
    const initialize = react_1.useCallback((mapOrTuple = []) => {
        setMap(() => new Map(mapOrTuple));
    }, []);
    const actions = react_1.useMemo(() => ({
        setValue: setMap,
        clear,
        set,
        // TODO: To be removed in the next major release
        remove: deleteByKey,
        delete: deleteByKey,
        initialize,
    }), [clear, deleteByKey, initialize, set]);
    return [map, actions];
}
exports.useMap = useMap;
exports.default = useMap;
//# sourceMappingURL=useMap.js.map