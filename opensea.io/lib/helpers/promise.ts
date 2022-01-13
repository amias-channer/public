type Callback<T> = (error: Error, result: T) => unknown
export type Promiseable<T> = T | Promise<T>

/**
 * Many legacy library functions implement their asynchronous behavior using callbacks.
 * It's generally more convenient and a best practice to use promises instead.
 * This converts a function using the callback pattern into one that returns a promise.
 *
 * @param fn A function that takes a callback as its last argument.
 * The callback should take an error (if any) as the first argument and the result data (if any) as the second argument.
 */
const promisifyAny =
  <T>(fn: (...args: any[]) => unknown): ((...args: any[]) => Promise<T>) =>
  async (...args: any[]) =>
    new Promise((resolve, reject) =>
      fn(...args, (error: any, result: any) =>
        error ? reject(error) : resolve(result),
      ),
    )

/**
 * The promisify{X} functions preserve the type information of the input function.
 * X is the number of parameters the function takes excluding the last one (the callback).
 * @param fn A function with X parameters as well as a callback as the last parameter.
 */
export const promisify0 = <T>(
  fn: (callback: Callback<T>) => unknown,
): (() => Promise<T>) => promisifyAny(fn)

export const promisify1 = <V0, T>(
  fn: (arg0: V0, callback: Callback<T>) => unknown,
): ((arg0: V0) => Promise<T>) => promisifyAny(fn)

export const promisify2 = <V0, V1, T>(
  fn: (arg0: V0, arg1: V1, callback: Callback<T>) => unknown,
): ((arg0: V0, arg1: V1) => Promise<T>) => promisifyAny(fn)

export const promisify3 = <V0, V1, V2, T>(
  fn: (arg0: V0, arg1: V1, arg2: V2, callback: Callback<T>) => unknown,
): ((arg0: V0, arg1: V1, arg2: V2) => Promise<T>) => promisifyAny(fn)

export const poll = <T>(opts: {
  delay: number
  fn: () => Promiseable<T | undefined>
  maxTries?: number
}): { value: Promise<T | undefined>; cancel: () => void } => {
  let cancelled = false
  return {
    value: new Promise((resolve, reject) => {
      const callback = async (tryCount: number) => {
        const result = await opts.fn()
        if (result !== undefined || cancelled) {
          resolve(result)
          return
        }
        if (tryCount >= (opts.maxTries ?? Infinity)) {
          reject(new Error("Max retries reached while polling."))
          return
        }
        setTimeout(() => callback(tryCount + 1), opts.delay)
      }
      callback(1).catch(reject)
    }),
    cancel: () => {
      cancelled = true
    },
  }
}

export const wait = (delay: number): Promise<undefined> =>
  new Promise(resolve => setTimeout(resolve, delay))
