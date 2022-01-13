import ErrorActions from "../../actions/errors"
import { IS_SERVER } from "../../constants"
import { dispatch } from "../../store"
import Wallet, { Account } from "../chain/wallet"
import { authLoginMutation } from "../graphql/__generated__/authLoginMutation.graphql"
import { graphql, mutateGlobal } from "../graphql/graphql"
import { addressesEqual } from "../helpers/addresses"
import Subject from "../helpers/subject"
import { signChallenge } from "./challenge"
import { decodeJwtToken, isJwtExpired, matchesJwtSchema } from "./jwt"
import {
  getSession as getSessionFromStorage,
  removeAllSessions,
  removeSession,
  setSession,
} from "./storage"
import { IdentityKey, JWTPayload, Session } from "./types"

const loginSubject = new Subject<boolean>()

const UNSAFE_getActiveSession = async (): Promise<Session | undefined> => {
  if (IS_SERVER) {
    return undefined
  }
  const wallet = Wallet.UNSAFE_get()
  return getValidSession(wallet.activeAccount)
}

const doesJwtBelongToAccount = (account: Account, payload: JWTPayload) => {
  return (
    account.user?.relayId === payload.user_id ||
    addressesEqual(account.address, payload.address)
  )
}

export const getValidSession = async (activeAccount: Account | undefined) => {
  if (!activeAccount) {
    return undefined
  }

  const accountKey: IdentityKey = {
    address: activeAccount.address,
  }

  const session = await getSessionFromStorage(accountKey)
  if (!session) {
    return undefined
  }

  const { payload } = session
  if (isJwtExpired(payload) || !matchesJwtSchema(payload)) {
    removeSession(accountKey)
    return undefined
  }

  if (doesJwtBelongToAccount(activeAccount, payload)) {
    return session
  }

  return undefined
}

const UNSAFE_login = () => {
  const wallet = Wallet.UNSAFE_get()
  return login(wallet)
}

const login = async (wallet: Wallet): Promise<boolean> => {
  const provider = await wallet.getProviderOrRedirect()
  const accountKey = wallet.getActiveAccountKey()
  if (!wallet.activeAccount || !accountKey || !provider) {
    console.info("No active account. Aborting login")
    return false
  }
  const session = await getValidSession(wallet.activeAccount)
  if (session) {
    return true
  }
  if (loginSubject.isPending) {
    return loginSubject.observe()
  }

  const identity: IdentityKey = {
    address: accountKey.address,
  }

  console.log("Authenticating", identity)
  loginSubject.begin()
  try {
    const signedMessage = await signChallenge()
    const {
      auth: { login },
    } = await mutateGlobal<authLoginMutation>(
      graphql`
        mutation authLoginMutation(
          $address: AddressScalar!
          $identity: IdentityInputType!
          $message: String!
          $signature: String!
          $chain: ChainScalar
        ) {
          auth {
            login(
              address: $address
              identity: $identity
              message: $message
              signature: $signature
              chain: $chain
            ) {
              token
            }
          }
        }
      `,
      { ...signedMessage, identity, chain: await provider.getChain() },
    )
    if (!login) {
      return false
    }
    const { token } = login
    console.log("Authenticated", identity)
    await setSession(identity, { token, payload: decodeJwtToken(token) })
    loginSubject.resolve(true)
    return true
  } catch (error) {
    dispatch(ErrorActions.show(error, `Authentication error: ${error.message}`))
    loginSubject.reject(error)
    throw error
  }
}

const logout = async (): Promise<void> => {
  if (IS_SERVER) {
    return
  }
  console.warn("Logging out")
  await removeAllSessions()
}

const Auth = {
  UNSAFE_getActiveSession,
  getValidSession,
  UNSAFE_login,
  login,
  logout,
  signChallenge,
}

export default Auth
