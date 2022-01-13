import { useEffect, useRef } from 'react';
/**
 * Creates a ref whose value is updated in an effect, ensuring the most recent
 * value is the one rendered with. Useful to reduce effect dependencies.
 *
 * Based on https://react-restart.github.io/hooks/api/useCommittedRef
 *
 * @param {T} value The ref value
 * @returns {React.MutableRefObject}
 */
export default function useCommittedRef(value) {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
}
//# sourceMappingURL=use-committed-ref.js.map