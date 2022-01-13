export default function isRequestTimeoutError(error) {
    const { httpStatus } = error;
    // 408 – our BE closed a request by timeout
    // 502 - proxy or NGNIX cancelled a request
    // 0   - browser cancelled long pending request
    return httpStatus === 408 || httpStatus === 502 || httpStatus === 0;
}
//# sourceMappingURL=is-request-timeout-error.js.map