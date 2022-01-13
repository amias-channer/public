import BigNumber from "bignumber.js"
import { isValidAddress } from "ethereumjs-util"
import {
  ChainIdentifier,
  MAX_ADDRESS_LENGTH,
  NULL_ACCOUNT,
} from "../../constants"
import { Token, EMPTY_TOKEN_FOR_ETH } from "../../reducers/tokens"
import { getState } from "../../store"
import { IdentityInputType } from "../graphql/__generated__/accountQuery.graphql"
import { addresses_data } from "../graphql/__generated__/addresses_data.graphql"
import {
  addressesAccountQuery,
  addressesAccountQueryResponse,
} from "../graphql/__generated__/addressesAccountQuery.graphql"
import { fetch, graphql } from "../graphql/graphql"
import { inlineFragmentize } from "../graphql/inline"
import { bn } from "./numberUtils"
import { truncateTextInMiddle } from "./stringUtils"

/**
 * See if two addresses are equal
 * @param addressOne address
 * @param addressTwo address
 */
export function addressesEqual(
  addressOne: string | null | undefined,
  addressTwo: string | null | undefined,
) {
  if (!addressOne || !addressTwo) {
    return addressOne == addressTwo
  } else {
    return addressOne.toLowerCase() == addressTwo.toLowerCase()
  }
}

/**
 * Look up the payment token contract for an address
 * @param address address to check
 */
export function addressToToken(address: string) {
  const token = getState().tokens.tokens.filter(
    (t: Token) => t.address === address,
  )[0]
  return token
}

/**
 * Get USD price of a token
 * @param token Token to check
 */
export const getUSDPrice = (token: Token): BigNumber =>
  token.usdPrice ? bn(token.usdPrice) : bn(0)

/**
 * Get token for ETH
 */
export const getEth = () => addressToToken(NULL_ACCOUNT) || EMPTY_TOKEN_FOR_ETH

export const resolveIdentity = (
  identifier?: string,
  chain?: ChainIdentifier,
): IdentityInputType =>
  identifier
    ? identifier.includes(".")
      ? { name: identifier, chain }
      : isValidAddress(identifier)
      ? { address: identifier, chain }
      : { username: identifier, chain }
    : {}

export const fetchAccount = async (
  identity: IdentityInputType,
): Promise<addressesAccountQueryResponse["account"]> => {
  const data = await fetch<addressesAccountQuery>(
    graphql`
      query addressesAccountQuery($identity: IdentityInputType!) {
        account(identity: $identity) {
          address
          user {
            publicUsername
          }
        }
      }
    `,
    { identity },
  )
  return data.account
}

export const truncateAddress = (address: string) => {
  return truncateTextInMiddle(address, { before: 6, after: 4 })
}

export const readAccountAddress = inlineFragmentize<addresses_data, string>(
  graphql`
    fragment addresses_data on AccountType @inline {
      address
    }
  `,
  account => account.address,
)

export const formatAddress = (address: string) =>
  address.substring(2, MAX_ADDRESS_LENGTH + 2).toUpperCase()
