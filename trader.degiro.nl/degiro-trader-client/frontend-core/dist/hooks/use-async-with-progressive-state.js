import * as React from 'react';
import createCancellablePromise from '../utils/async/create-cancellable-promise';
const { useState, useEffect } = React;
/*
    ┌────────────────────┐
    │Init                │                 Signals:
    └────────────────────┘                   : Update
             + ││ -                        + : Success
               │└───────────┐              - : Fail
               │            ▼
               │ ┌────────────────────┐    States:
               │ │Error               │◀┐
               │ └────────────────────┘ │  Init               : {isLoading: true}
               │ ┌────────────────────┐ │
               │ │Fixing Error        │ │  Ok                 : {isLoading: false, value: Value}
               │ └────────────────────┘ │  Error              : {isLoading: false, error: Error}
               │        +   ││  -       │
               │ ┌──────────┘└──────────┘  Updating Ok        : {isLoading: true, value: Value}
  ┌──────────┐ │ │ ┌───────┐               Fixing error       : {isLoading: true, error: Error}
  │          ▼ ▼ ▼ ▼       │
  │ ┌────────────────────┐ │               Ok -> Error        : {isLoading: false, value: Value, error: Error}
  │ │Ok                  │ │
  │ └────────────────────┘ │               Fixing Ok -> Error : {isLoading: true,  value: Value, error: Error}
  │ ┌────────────────────┐ │
  │ │Updating Ok         │ │
  │ └────────────────────┘ │
  │         + ││ -         │
  └───────────┘▼           │
    ┌────────────────────┐ │
  ┌▶│Ok -> Error         │ │
  │ └────────────────────┘ │
  │ ┌────────────────────┐ │
  │ │Fixing Ok -> Error  │ │
  │ └────────────────────┘ │
  │         -  ││ +        │
  └────────────┘└──────────┘
*/
export default function useAsyncWithProgressiveState(asyncFn, deps) {
    const [value, setValue] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const cancellablePromise = createCancellablePromise(asyncFn({ value, error, isLoading }));
        setIsLoading(true);
        cancellablePromise.promise
            .then((value) => {
            setIsLoading(false);
            setError(undefined);
            setValue(value);
        })
            .catch((error) => {
            /*
             For error state we do not clear value.
             This is useful for cases where you want to show "update" error message on top
             of some existing data
            */
            setIsLoading(false);
            setError(error);
        });
        return cancellablePromise.cancel;
    }, deps);
    return { error, value, isLoading };
}
//# sourceMappingURL=use-async-with-progressive-state.js.map