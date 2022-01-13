import * as React from 'react';
import createCancellablePromise from '../utils/async/create-cancellable-promise';
const { useState, useEffect } = React;
export default function useAsync(asyncFn, deps) {
    const [value, setValue] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const cancellablePromise = createCancellablePromise(asyncFn());
        setIsLoading(true);
        setError(undefined);
        setValue(undefined);
        cancellablePromise.promise
            .then((value) => {
            setIsLoading(false);
            setValue(value);
        })
            .catch((error) => {
            setIsLoading(false);
            setError(error);
        });
        return cancellablePromise.cancel;
    }, deps);
    if (isLoading) {
        return { isLoading, error: undefined, value: undefined };
    }
    if (error) {
        return { isLoading, error, value: undefined };
    }
    return { value: value, isLoading, error: undefined };
}
//# sourceMappingURL=use-async.js.map