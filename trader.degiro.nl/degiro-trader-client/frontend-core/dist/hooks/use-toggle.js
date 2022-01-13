import * as React from 'react';
const { useCallback, useState } = React;
export default function useToggle(defaultValue = false) {
    const [isOpened, setIsOpened] = useState(defaultValue);
    return {
        isOpened,
        toggle: useCallback(() => setIsOpened((isOpened) => !isOpened), []),
        open: useCallback(() => setIsOpened(true), []),
        close: useCallback(() => setIsOpened(false), [])
    };
}
//# sourceMappingURL=use-toggle.js.map