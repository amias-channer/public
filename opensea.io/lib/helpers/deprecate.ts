import { IS_PRODUCTION } from "../../constants"

const deprecate = <T extends (...args: any[]) => any>(
  f: T,
  message: string,
): T =>
  ((...args) => {
    if (!IS_PRODUCTION) {
      // Disabled until fewer warnings happen on the Store.dispatch
      // (hard to debug)
      console.warn(`DEPRECATION WARNING: ${message}`)
    }
    return f(...args)
  }) as T

export default deprecate
