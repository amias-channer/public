import moment, { Moment } from "moment"
import { AppContextProps } from "../../AppContext"
import {
  BLACKLISTED_META_TRANSACTION_COLLECTIONS,
  BLACKLISTED_META_TRANSACTION_CONTRACTS,
  ChainIdentifier,
  IS_PRODUCTION,
  TEST_MULTICHAIN_COLLECTIONS,
} from "../../constants"
import { ordersTermsAcceptanceMutation } from "../graphql/__generated__/ordersTermsAcceptanceMutation.graphql"
import { graphql } from "../graphql/graphql"
import { isMultichain, isSupportedChain } from "./chainUtils"
import { bn } from "./numberUtils"

// Temp logic here until we can roll out order v2 more widely. Only enable order v2 on test net and open sea creatures and test multichain collection
export const isOrderV2Enabled = ({
  chain,
  address,
  slug,
}: {
  chain?: ChainIdentifier
  address?: string
  slug?: string
}) => {
  if (isMultichain(chain)) {
    return !shouldShowMultichainModal(chain, slug)
  }

  return (
    address === "0x7dca125b1e805dc88814aed7ccc810f677d3e1db" ||
    slug === "treasure-chests"
  )
}

export const shouldUseMetaTransactions = ({
  chain,
  address,
  slug,
}: {
  chain?: ChainIdentifier
  address?: string
  slug?: string
}) => {
  if (
    (address && BLACKLISTED_META_TRANSACTION_CONTRACTS.includes(address)) ||
    (slug && BLACKLISTED_META_TRANSACTION_COLLECTIONS.includes(slug))
  ) {
    return false
  }

  return isMultichain(chain)
}

export const shouldShowMultichainModal = (
  chain?: ChainIdentifier,
  collectionSlug?: string,
  isFungible?: boolean,
) => {
  if (isMultichain(chain)) {
    if (isFungible && chain === "KLAYTN") {
      return IS_PRODUCTION
    }
    return (!!collectionSlug &&
      TEST_MULTICHAIN_COLLECTIONS.includes(collectionSlug)) ||
      isSupportedChain(chain)
      ? false
      : IS_PRODUCTION
  }

  return false
}

export const getScheduledOrderText = (
  listingTime: Moment,
  action: "buy" | "sell" | "bid on",
) =>
  `You can't ${action} this item until ${listingTime.format(
    "MMMM D, YYYY [at] h:mma",
  )}`

export const getTotalAssetQuantity = ({
  pricePerUnit,
  quantity,
  decimals,
}: {
  pricePerUnit?: string
  quantity?: string
  decimals?: number | null
}) =>
  pricePerUnit && quantity
    ? bn(pricePerUnit)
        .times(bn(10).pow(decimals ?? 0))
        .times(quantity)
    : bn(0)

export const getMaxExpiryDate = () => moment().add(6, "months")

export const setTermsAcceptance =
  (mutate: AppContextProps["mutate"]) => async () => {
    await mutate<ordersTermsAcceptanceMutation>(
      graphql`
        mutation ordersTermsAcceptanceMutation(
          $input: UserModifyMutationInput!
        ) {
          users {
            modify(input: $input) {
              relayId
            }
          }
        }
      `,
      {
        input: {
          hasAffirmativelyAcceptedOpenseaTerms: true,
        },
      },
      { shouldAuthenticate: true },
    )
  }
