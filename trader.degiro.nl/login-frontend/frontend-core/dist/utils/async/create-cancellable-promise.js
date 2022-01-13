/**
 * @description
 *  It's a common case whe we need to cancel pending promise, e.g. in React component
 *  https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 * IMPORTANT: when we cancel promise we should keep in mind that links to its callbacks and closures still exist,
 * so we should clean them to make this promise "GC-friendly"
 *
 * After the initial implementation D. Kniazevych found a similar solution for this case
 * https://github.com/hjylewis/trashable
 * "trashable" extends the native Promise object using "monkey-patching".
 * We avoid this to prevent collisions if in future native Promise instance get its own .cancel() method
 *
 * @link {https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html}
 * @link {https://github.com/facebook/react/issues/5465}
 * @link {https://github.com/hjylewis/trashable}
 *
 * @example
 *   const apiPromise = createCancellablePromise(asyncApiCall(...));
 *
 *   apiPromise.promise.then(() => ...).catch(...);
 *   ...
 *   apiPromise.cancel();
 *
 * !!! LIMITATIONS !!!
 *  - You should follow the order of promise chaining, see https://github.com/hjylewis/trashable#gotchas
 *  - NEVER add chain callbacks (.then, .catch, .finally) to the promise after .cancel() call
 *
 * @param {Promise} promise
 * @returns {any}
 */
export default function createCancellablePromise(promise) {
    let cancel = Function;
    const cancellablePromise = new Promise((resolve, reject) => {
        cancel = () => {
            // remove links for garbage collection
            resolve = null;
            reject = null;
        };
        promise.then((value) => {
            if (resolve) {
                resolve(value);
            }
        }, (error) => {
            if (reject) {
                reject(error);
            }
        });
    });
    return { promise: cancellablePromise, cancel };
}
//# sourceMappingURL=create-cancellable-promise.js.map