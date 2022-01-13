import {useEffect} from 'react';

/**
 * TODO: rewrite this hook to more generic one, like
 * useKeyboardShortcuts({
 *   'ctrl+n': action1,
 *   'ctrl+s': action2,
 *   ...
 * })
 * @param {Function} createOrder
 * @returns {void}
 */
export default function useKeyboardShortcuts(createOrder: () => void) {
    useEffect(() => {
        const onGlobalKeyUp = (event: KeyboardEvent) => {
            const {key} = event;

            // Cmd+N / Ctrl+N
            if ((event.ctrlKey || event.metaKey) && (key === 'n' || key === 'N')) {
                event.preventDefault();
                createOrder();
            }
        };

        document.addEventListener('keyup', onGlobalKeyUp);

        return () => document.removeEventListener('keyup', onGlobalKeyUp);
    }, []);
}
