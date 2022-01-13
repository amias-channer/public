import TokenActions from "../actions/tokens"
import { IS_SERVER } from "../constants"
import { dispatchAsync } from "../store"

/**
 * Prefetch data needed for the app
 * @param param0 __namedParameters, for the Router query object
 * @param accountAddress a user's account
 */
export async function prefetchAll() {
  if (IS_SERVER) {
    // client-side only
    return
  }

  await dispatchAsync(TokenActions.findAll())
}
