import * as React from 'react';
import { logErrorRemotely } from '../../../loggers/remote-logger';
import { onChunkLoadingError } from '../../../platform/dynamic-imports';
import createCancellablePromise from '../../../utils/async/create-cancellable-promise';
const { useState, useLayoutEffect } = React;
export default function createLazyComponent(getComponent, options = {}) {
    // do not export anonymous function to have readable component name in the snapshots
    const LazyComponent = ({ fallback = options.fallback, ...componentProps }) => {
        const [Component, setComponent] = useState();
        useLayoutEffect(() => {
            const componentPromise = createCancellablePromise(getComponent());
            componentPromise.promise
                // Do not confuse state setter and functional component (when module.default is Function)
                .then((module) => setComponent(() => module.default))
                .catch((error) => {
                onChunkLoadingError(error);
                logErrorRemotely(error);
            });
            return componentPromise.cancel;
        }, []);
        if (Component) {
            return React.createElement(Component, { ...componentProps });
        }
        return fallback || null;
    };
    return LazyComponent;
}
//# sourceMappingURL=create-lazy-component.js.map