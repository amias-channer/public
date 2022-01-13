import type { Promiseable } from "./promise"

const memoize = <T extends any[], U>(
  fn: (...args: T) => Promiseable<U>,
): ((...args: T) => Promise<U>) => {
  const cache = new Map<string, U>()

  return async (...args: T) => {
    const key = JSON.stringify(args)

    if (!cache.has(key)) {
      cache.set(key, await fn(...args))
    }
    return cache.get(key) as U
  }
}

export default memoize
