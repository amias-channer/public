import { useEffect, useState } from 'react';
import { getItem, setItem } from '../platform/localstorage';
import isFunction from '../utils/is-function';
export default function useLocalStorageState(key, defaultValue) {
    const [state, setState] = useState(() => {
        const storedValue = getItem(key);
        if (storedValue != null) {
            return storedValue;
        }
        return isFunction(defaultValue) ? defaultValue() : defaultValue;
    });
    useEffect(() => setItem(key, state), [key, state]);
    return [state, setState];
}
//# sourceMappingURL=use-local-storage-state.js.map