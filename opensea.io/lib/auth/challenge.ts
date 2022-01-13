import Wallet from "../chain/wallet"
import { challengeNonceQuery } from "../graphql/__generated__/challengeNonceQuery.graphql"
import { fetch, graphql } from "../graphql/graphql"
import { SignedMessage } from "./types"

const fetchChallenge = async (address: string): Promise<string> => {
  try {
    const data = await fetch<challengeNonceQuery>(
      graphql`
        query challengeNonceQuery($identity: IdentityInputType!) {
          account(identity: $identity) {
            nonce
          }
        }
      `,
      { identity: { address } },
    )
    const currentAccountNonce = data.account?.nonce
    if (!currentAccountNonce) {
      throw new Error(
        "There was an error fetching your nonce.  Please try again.",
      )
    }
    return `Welcome to OpenSea!\n\nClick "Sign" to sign in. No password needed!\n\nI accept the OpenSea Terms of Service: https://opensea.io/tos\n\nWallet address:\n${address.toLowerCase()}\n\nNonce:\n${currentAccountNonce}`
  } catch (error) {
    throw new Error(
      "There was an error fetching your nonce.  Please try again.",
    )
  }
}

export const signChallenge = async (): Promise<SignedMessage> => {
  const wallet = Wallet.UNSAFE_get()
  const accountKey = wallet.getActiveAccountKey()
  if (!accountKey) {
    throw new Error("No active account.")
  }
  const message = await fetchChallenge(accountKey.address)
  const signature = await wallet.sign(message)
  return { address: accountKey.address, message, signature }
}
