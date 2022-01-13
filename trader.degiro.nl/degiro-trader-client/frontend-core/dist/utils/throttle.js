function throttle(func, wait = 0, immediate = true) {
    let timeout;
    let lastArgs;
    const cancel = () => {
        self.clearTimeout(timeout);
        timeout = undefined;
    };
    const resultFn = immediate
        ? function (...args) {
            if (timeout === undefined) {
                timeout = self.setTimeout(cancel, wait);
                return func(...args);
            }
        }
        : function (...args) {
            lastArgs = args;
            if (timeout === undefined) {
                timeout = self.setTimeout(() => {
                    cancel();
                    func(...lastArgs);
                }, wait);
            }
        };
    resultFn.cancel = cancel;
    return resultFn;
}
export default throttle;
//# sourceMappingURL=throttle.js.map