export default function retryPromise(run, test, numberOfRetries) {
    return run()
        .catch(() => undefined)
        .then((value) => {
        if (test(value) || numberOfRetries === 0) {
            return value;
        }
        return retryPromise(run, test, numberOfRetries - 1);
    });
}
//# sourceMappingURL=retry-promise.js.map