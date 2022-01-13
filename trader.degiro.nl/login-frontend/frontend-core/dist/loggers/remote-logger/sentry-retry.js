let duration = 0;
let startTime = 0;
export function reset() {
    duration = 0;
    startTime = 0;
}
export function isWaiting() {
    return Boolean(duration && Date.now() - startTime < duration);
}
export function setFromResponse(response) {
    // If we are already in a backoff state, don't change anything
    if (isWaiting()) {
        return;
    }
    const { status } = response;
    /**
     * 400 - project_id doesn't exist or some other fatal
     * 401 - invalid/revoked dsn
     * 429 - too many requests
     */
    if (![400, 401, 429].includes(status)) {
        return;
    }
    let retry;
    try {
        // Retry-After is returned in seconds
        retry = parseInt(response.headers.get('Retry-After') || '0', 10) * 1000;
    }
    catch (_a) {
        //
    }
    /**
     * If Sentry server returned a Retry-After value - use it,
     * otherwise, double the last "backoff" duration (starts at 1 sec)
     */
    duration = retry || duration * 2 || 1000;
    startTime = Date.now();
}
//# sourceMappingURL=sentry-retry.js.map