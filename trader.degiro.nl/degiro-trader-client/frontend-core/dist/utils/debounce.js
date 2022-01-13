function debounce(func, wait = 0, immediate = true) {
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
            self.clearTimeout(timeout);
            timeout = self.setTimeout(cancel, wait);
        }
        : function (...args) {
            lastArgs = args;
            self.clearTimeout(timeout);
            timeout = self.setTimeout(() => {
                cancel();
                func(...lastArgs);
            }, wait);
        };
    resultFn.cancel = cancel;
    return resultFn;
}
export default debounce;
//# sourceMappingURL=debounce.js.map