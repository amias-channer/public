interface ThrottleOptions {
  duration?: number
  force?: boolean // Call the function immediately. Subsequent non-force calls are still throttled.
}

export type ThrottledFunc<T, U> = (
  x?: T,
  options?: ThrottleOptions,
) => Promise<U>

const DEFAULT_TIMEOUT_DURATION = 500

const timeouts: Map<unknown, number> = new Map()

const defer = (fn: unknown, duration?: number, callback?: () => unknown) =>
  timeouts.set(
    fn,
    window.setTimeout(() => {
      timeouts.delete(fn)
      if (callback) {
        callback()
      }
    }, duration || DEFAULT_TIMEOUT_DURATION),
  )

const throttle =
  <T, U>(
    fn: (x?: T) => U | Promise<U>,
    baseOptions?: ThrottleOptions,
  ): ThrottledFunc<T, U> =>
  (x, opts) => {
    const options = { ...baseOptions, ...opts }
    return new Promise(resolve => {
      const timeout = timeouts.get(fn)
      clearTimeout(timeout)
      if (options.force) {
        defer(fn, options.duration)
        resolve(fn(x))
        return
      }
      defer(fn, options.duration, () => resolve(fn(x)))
    })
  }
export default throttle
