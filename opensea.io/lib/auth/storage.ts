import localForage from "localforage"
import { IS_SERVER } from "../../constants"
import { captureWarning } from "../analytics/analytics"
import { decodeJwtToken } from "./jwt"
import { Session, IdentityKey } from "./types"

const SESSION_STORAGE_KEY_PREFIX = "session:"

const getSessionStorageKey = ({ address }: IdentityKey) => {
  return `${SESSION_STORAGE_KEY_PREFIX}${address}`
}

export const setSession = async (
  key: IdentityKey,
  session: Session,
): Promise<void> => {
  if (IS_SERVER) {
    return undefined
  }

  const storageKey = getSessionStorageKey(key)
  try {
    await localForage.setItem(storageKey, session.token)
  } catch (error) {
    // Browser probably blocked it, like Brave does for iframes.
    captureWarning(error)
  }
}

/* Clear session associated with an account key */
export const removeSession = (key: IdentityKey) => {
  if (IS_SERVER) {
    return undefined
  }
  return localForage.removeItem(getSessionStorageKey(key))
}

/* Clear all sessions */
export const removeAllSessions = async () => {
  if (IS_SERVER) {
    return undefined
  }

  const keys = await localForage.keys()
  const sessionKeys = keys.filter(k => k.startsWith(SESSION_STORAGE_KEY_PREFIX))
  return await Promise.all(sessionKeys.map(key => localForage.removeItem(key)))
}

/* Get session associated with an account key */
export const getSession = async (
  accountKey: IdentityKey,
): Promise<Session | undefined> => {
  if (IS_SERVER) {
    return undefined
  }

  const storageKey = getSessionStorageKey(accountKey)
  try {
    const token = await localForage.getItem<string | undefined>(storageKey)
    if (!token) {
      return undefined
    }
    return { token, payload: decodeJwtToken(token) }
  } catch (error) {
    captureWarning(error)
    await removeSession(accountKey)
    return undefined
  }
}
