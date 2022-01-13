import { useEffect, useState } from 'react';
function useStateFromProp(propValue, adapter) {
    const state = useState(adapter ? adapter(propValue) : propValue);
    const setState = state[1];
    useEffect(() => setState(adapter ? adapter(propValue) : propValue), [propValue]);
    // https://github.com/microsoft/TypeScript/issues/24929#issuecomment-397071586
    return state;
}
export default useStateFromProp;
//# sourceMappingURL=use-state-from-prop.js.map